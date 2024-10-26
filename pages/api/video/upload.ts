import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { processVideo } from '../../../utils/videoProcessor';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const form = formidable({
      uploadDir: path.join(process.cwd(), 'uploads'),
      keepExtensions: true,
    });
    
    form.parse(req, async (err, fields, files: formidable.Files) => {
      if (err) {
        return res.status(500).json({ error: 'Error parsing form data' });
      }

      const file = files.file?.[0];
      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      // 生成唯一的文件名
      const uniqueFilename = `${Date.now()}-${file.originalFilename}`;
      const newPath = path.join(form.uploadDir as string, uniqueFilename);

      // 移动文件到新的位置
      fs.renameSync(file.filepath, newPath);

      // 创建一个新文件来存储上传文件的信息
      const fileInfoPath = path.join(form.uploadDir as string, `${uniqueFilename}.info.json`);
      const fileInfo = {
        originalName: file.originalFilename,
        size: file.size,
        type: file.mimetype,
        uploadedAt: new Date().toISOString(),
      };
      fs.writeFileSync(fileInfoPath, JSON.stringify(fileInfo, null, 2));

      try {
        const result = await processVideo(newPath);
        return res.status(200).json({ 
          message: 'Video processed successfully', 
          result,
          fileInfo: {
            name: uniqueFilename,
            path: newPath,
            info: fileInfoPath,
          }
        });
      } catch (error) {
        console.error('Error processing video:', error);
        return res.status(500).json({ error: 'Error processing video' });
      }
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
