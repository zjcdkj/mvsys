import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { extractAudio, getAudioDuration, checkFFmpeg, getFFmpegVersion, getAudioFileUrl } from '../../../utils/videoProcessor';

// 在文件顶部添加这个接口定义
interface FileInfo {
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  audioFile?: string;
}

// 在文件顶部添加这个导入
import { File } from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadDir = path.join(process.cwd(), 'uploads');
const recordsFile = path.join(process.cwd(), 'upload_records.json');

// 确保上传目录存在
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 确保记录文件存在
if (!fs.existsSync(recordsFile)) {
  fs.writeFileSync(recordsFile, JSON.stringify([]));
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { action } = req.query;

  console.log(`Received ${req.method} request for action: ${action}`);

  try {
    // 只在需要使用 FFmpeg 的��作中进行检查
    if (action === 'extractAudio') {
      const ffmpegAvailable = await checkFFmpeg();
      if (!ffmpegAvailable) {
        return res.status(500).json({ error: 'FFmpeg is not available' });
      }
    }

    switch (action) {
      case 'upload':
        if (req.method === 'POST') {
          console.log('Processing file upload');
          const form = formidable({
            uploadDir: uploadDir,
            keepExtensions: true,
            maxFileSize: 200 * 1024 * 1024, // 200MB
          });

          form.parse(req, (err, fields, files) => {
            if (err) {
              console.error('Error parsing form:', err);
              return res.status(500).json({ error: 'Error parsing form data', details: err.message });
            }

            console.log('Form parsed successfully');

            const file = (files.file as File[])?.[0];
            if (!file) {
              console.error('No file uploaded');
              return res.status(400).json({ error: 'No file uploaded' });
            }

            console.log('File received:', file.originalFilename);

            if (file.size > 200 * 1024 * 1024) {
              console.error('File size exceeds limit:', file.size);
              return res.status(400).json({ error: 'File size exceeds 200MB limit' });
            }

            if (file.mimetype !== 'video/mp4') {
              console.error('Invalid file type:', file.mimetype);
              return res.status(400).json({ error: 'Only MP4 files are allowed' });
            }

            // 生成新的文件名
            const originalName = path.parse(file.originalFilename || '').name;
            const extension = path.parse(file.originalFilename || '').ext;
            let newFilename = `${originalName}${extension}`;
            let counter = 1;

            // 检查文件是否已存在，如果存在则重命名
            while (fs.existsSync(path.join(uploadDir, newFilename))) {
              newFilename = `${originalName}(${counter})${extension}`;
              counter++;
            }

            const newPath = path.join(uploadDir, newFilename);
            fs.renameSync(file.filepath, newPath);

            const fileInfo = {
              originalName: file.originalFilename,
              name: newFilename,
              size: file.size,
              type: file.mimetype,
              uploadedAt: new Date().toISOString(),
            };

            // 添加文件记录
            const records = JSON.parse(fs.readFileSync(recordsFile, 'utf-8'));
            records.push(fileInfo);
            fs.writeFileSync(recordsFile, JSON.stringify(records, null, 2));

            console.log('File uploaded successfully:', fileInfo);

            return res.status(200).json({ message: 'File uploaded successfully', fileInfo });
          });
        } else {
          res.setHeader('Allow', ['POST']);
          res.status(405).end(`Method ${req.method} Not Allowed`);
        }
        break;

      case 'list':
        if (req.method === 'GET') {
          try {
            const records = JSON.parse(fs.readFileSync(recordsFile, 'utf-8'));
            console.log('Records retrieved:', records);
            res.status(200).json(records);
          } catch (error) {
            console.error('Error reading records file:', error);
            res.status(500).json({ error: 'Error retrieving file records' });
          }
        } else {
          res.setHeader('Allow', ['GET']);
          res.status(405).end(`Method ${req.method} Not Allowed`);
        }
        break;

      case 'delete':
        if (req.method === 'DELETE') {
          // 使用 URL 参数而不是请求体
          const { filename } = req.query;
          if (!filename || typeof filename !== 'string') {
            return res.status(400).json({ error: 'Filename is required' });
          }

          const filePath = path.join(uploadDir, filename);
          const audioFilePath = path.join(process.cwd(), 'download', 'mp3', `${path.parse(filename).name}.mp3`);
          
          console.log('Attempting to delete file:', filePath);
          
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log('Video file deleted successfully');
            
            // 删除对应的音频文件（如果存）
            if (fs.existsSync(audioFilePath)) {
              fs.unlinkSync(audioFilePath);
              console.log('Audio file deleted successfully');
            }
            
            // 更新记录文件
            const records = JSON.parse(fs.readFileSync(recordsFile, 'utf-8'));
            const updatedRecords = records.filter((record: FileInfo) => record.name !== filename);
            fs.writeFileSync(recordsFile, JSON.stringify(updatedRecords, null, 2));
            
            res.status(200).json({ message: 'File deleted successfully' });
          } else {
            console.log('File not found:', filePath);
            res.status(404).json({ error: 'File not found' });
          }
        } else {
          res.setHeader('Allow', ['DELETE']);
          res.status(405).end(`Method ${req.method} Not Allowed`);
        }
        break;

      case 'rename':
        if (req.method === 'PUT') {
          const { oldName, newName } = req.body;
          const oldPath = path.join(uploadDir, oldName);
          const newPath = path.join(uploadDir, newName);
          if (fs.existsSync(oldPath)) {
            fs.renameSync(oldPath, newPath);
            res.status(200).json({ message: 'File renamed successfully' });
          } else {
            res.status(404).json({ error: 'File not found' });
          }
        } else {
          res.setHeader('Allow', ['PUT']);
          res.status(405).end(`Method ${req.method} Not Allowed`);
        }
        break;

      case 'extractAudio':
        if (req.method === 'POST') {
          const form = formidable();
          form.parse(req, async (err, fields, files) => {
            if (err) {
              console.error('Error parsing form:', err);
              return res.status(500).json({ error: 'Error parsing form data' });
            }

            const filename = Array.isArray(fields.filename) ? fields.filename[0] : fields.filename;
            if (!filename) {
              return res.status(400).json({ error: 'Filename is required' });
            }

            console.log('Extracting audio for file:', filename);

            // 检查多个可能的路径
            const possiblePaths = [
              path.join(process.cwd(), 'uploads', filename),
              path.join(process.cwd(), 'public', 'uploads', filename),
              path.join(process.cwd(), 'download', 'mp4', filename)
            ];

            let videoPath = '';
            for (const p of possiblePaths) {
              console.log('Checking path:', p);
              if (fs.existsSync(p)) {
                videoPath = p;
                break;
              }
            }

            if (!videoPath) {
              console.error('Video file not found in any of the checked paths');
              return res.status(404).json({ error: 'Video file not found' });
            }

            console.log('Found video file at:', videoPath);

            try {
              // 在提取音频之前检查 FFmpeg
              const ffmpegAvailable = await checkFFmpeg();
              if (!ffmpegAvailable) {
                return res.status(500).json({ error: 'FFmpeg is not available' });
              }

              // 获取 FFmpeg 版本
              const ffmpegVersion = await getFFmpegVersion();
              console.log('FFmpeg version:', ffmpegVersion);

              // 使用 SSE (Server-Sent Events) 来报告进度
              res.writeHead(200, {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive'
              });

              const audioPath = await extractAudio(videoPath);
              const audioFilename = path.basename(audioPath);
              
              console.log('Audio extracted successfully:', audioFilename);

              // 获取音频时长
              const duration = await getAudioDuration(audioPath);

              // 获取音频文件大小
              const { size } = fs.statSync(audioPath);

              // 更新文件记录
              const records = JSON.parse(fs.readFileSync(recordsFile, 'utf-8'));
              const updatedRecords = records.map((record: FileInfo) => {
                if (record.name === filename) {
                  return { ...record, audioFile: audioFilename };
                }
                return record;
              });
              fs.writeFileSync(recordsFile, JSON.stringify(updatedRecords, null, 2));

              res.write(`data: ${JSON.stringify({ complete: true, audioFile: audioFilename, duration, size })}\n\n`);
              res.end();
            } catch (error) {
              console.error('Error extracting audio:', error);
              res.write(`data: ${JSON.stringify({ error: 'Error extracting audio', details: (error as Error).message })}\n\n`);
              res.end();
            }
          });
        } else {
          res.setHeader('Allow', ['POST']);
          res.status(405).end(`Method ${req.method} Not Allowed`);
        }
        break;

      case 'getAudio':
        if (req.method === 'GET') {
          const { filename } = req.query;
          if (typeof filename !== 'string') {
            return res.status(400).json({ error: 'Invalid filename' });
          }
          try {
            const audioUrl = await getAudioFileUrl(filename);
            res.status(200).json({ url: audioUrl });
          } catch (error) {
            console.error('Error getting audio URL:', error);
            res.status(404).json({ error: 'Audio file not found' });
          }
        } else {
          res.setHeader('Allow', ['GET']);
          res.status(405).end(`Method ${req.method} Not Allowed`);
        }
        break;

      case 'getAudioUrl':
        if (req.method === 'GET') {
          const { filename } = req.query;
          if (typeof filename !== 'string') {
            return res.status(400).json({ error: 'Invalid filename' });
          }
          try {
            const url = await getAudioFileUrl(filename);
            console.log('Audio URL generated:', url); // 添加日志
            return res.status(200).json({ url });
          } catch (error) {
            console.error('Error getting audio URL:', error); // 添加错误日志
            return res.status(404).json({ error: 'Audio file not found' });
          }
        } else {
          res.setHeader('Allow', ['GET']);
          res.status(405).end(`Method ${req.method} Not Allowed`);
        }
        break;

      default:
        console.error('Invalid action:', action);
        res.status(404).json({ error: 'Action not found' });
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ error: 'An unexpected error occurred', details: (error as Error).message });
  }
}
