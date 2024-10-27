import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import { MongoClient } from 'mongodb';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import ffprobeInstaller from '@ffprobe-installer/ffprobe';
import { promisify } from 'util';
import { promises as fsPromises } from 'fs';
import { connectToDatabase } from './database';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://api.openai-hub.com/v1', // 使用您提供的自定义 URL
});

const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.error('MONGODB_URI is not defined in the environment variables');
  process.exit(1);
}

console.log('MongoDB URI:', mongoUri);

let mongoClient: MongoClient | null = null;

async function getMongoClient() {
  if (!mongoUri) {
    throw new Error('MONGODB_URI is not defined');
  }
  if (!mongoClient) {
    try {
      mongoClient = new MongoClient(mongoUri);
      await mongoClient.connect();
      console.log('Connected successfully to MongoDB');
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error);
      throw error;
    }
  }
  return mongoClient;
}

function runCommand(command: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(command, { encoding: 'utf8' }, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${command}`);
        console.error(`Error: ${error}`);
        console.error(`stderr: ${stderr}`);
        reject(error);
      } else {
        resolve(stdout);
      }
    });
  });
}

export async function processVideo(filePath: string) {
  try {
    // 1. 音频分离
    const audioFile = await extractAudio(filePath);

    // 2. 音频转文本
    const textContent = await convertSpeechToText(audioFile);

    // 3. 文本清洗
    const cleanedText = await cleanText(textContent);

    // 4. 文本存储
    await storeText([cleanedText]);

    // 5. 高级分析
    const analysisResult = await performAdvancedAnalysis([cleanedText]);

    return analysisResult;
  } catch (error) {
    console.error('Error in video processing:', error);
    throw error;
  }
}

export function extractAudio(videoPath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const outputDir = path.join(process.cwd(), 'public', 'audio');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    const outputPath = path.join(outputDir, `${path.basename(videoPath, '.mp4')}.mp3`);
    
    console.log('Input video path:', videoPath);
    console.log('Output audio path:', outputPath);

    ffmpeg(videoPath)
      .outputOptions('-vn')
      .audioCodec('libmp3lame')
      .audioChannels(2)
      .audioBitrate('192k')
      .output(outputPath)
      .on('end', async () => {
        console.log('Audio extraction completed:', outputPath);
        try {
          const { db } = await connectToDatabase();
          const collection = db.collection('audio_files');
          const duration = await getAudioDuration(outputPath);
          await collection.insertOne({
            name: path.basename(outputPath),
            size: fs.statSync(outputPath).size,
            createdAt: new Date(),
            path: outputPath,
            originalVideo: path.basename(videoPath),
            duration: duration,
            transcriptionStatus: 'not_transcribed'
          });
          resolve(outputPath);
        } catch (error) {
          console.error('Error saving audio file info to database:', error);
          reject(error);
        }
      })
      .on('error', (err) => {
        console.error('Error during audio extraction:', err);
        reject(err);
      })
      .run();
  });
}

export async function convertSpeechToText(audioFile: string, progressCallback?: (progress: number) => void): Promise<string> {
  try {
    const audioPath = path.join(process.cwd(), 'public', 'audio', audioFile);
    if (!fs.existsSync(audioPath)) {
      throw new Error(`Audio file not found: ${audioPath}`);
    }

    // 模拟转录进度
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 500)); // 每0.5秒更新一次进度
      progressCallback && progressCallback(i);
    }

    const response = await openai.audio.transcriptions.create({
      file: fs.createReadStream(audioPath),
      model: "whisper-1",
    });
    
    const transcription = response.text;
    
    // 保存转录文本为 txt 文件
    const txtFilePath = audioPath.replace('.mp3', '.txt');
    await fsPromises.writeFile(txtFilePath, transcription, 'utf-8');
    
    console.log('Transcription saved to:', txtFilePath);
    return transcription;
  } catch (error) {
    console.error('Error in speech to text conversion:', error);
    throw error;
  }
}

export async function cleanText(text: string): Promise<string> {
  // 这里可以实现文本清洗的逻辑
  // 例如：移除特殊字符，纠正常见错误等
  let cleanedText = text.replace(/[^\w\s.,?!]/g, '');
  cleanedText = cleanedText.replace(/\s+/g, ' ').trim();
  return cleanedText;
}

async function storeText(texts: string[]): Promise<void> {
  const client = await getMongoClient();
  try {
    const db = client.db('video_analysis');
    const collection = db.collection('transcripts');
    await collection.insertMany(texts.map(text => ({ content: text })));
    console.log('Texts stored successfully in MongoDB');
  } catch (error) {
    console.error('Error storing texts in MongoDB:', error);
    throw error;
  }
}

async function performAdvancedAnalysis(texts: string[]): Promise<any> {
  return { analysis: "Sample analysis result" };
}

export async function getAudioDuration(filePath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        reject(err);
        return;
      }
      const durationInSeconds = metadata.format.duration;
      resolve(durationInSeconds);
    });
  });
}

export async function checkFFmpeg(): Promise<boolean> {
  try {
    const getAvailableFormats = promisify(ffmpeg.getAvailableFormats);
    await getAvailableFormats();
    console.log('FFmpeg is available');
    return true;
  } catch (error) {
    console.error('Error checking FFmpeg:', error);
    return false;
  }
}

export async function getFFmpegVersion(): Promise<string> {
  try {
    const getAvailableCodecs = promisify(ffmpeg.getAvailableCodecs);
    const getAvailableEncoders = promisify(ffmpeg.getAvailableEncoders);
    
    const codecs = await getAvailableCodecs();
    const encoders = await getAvailableEncoders();
    
    return `FFmpeg version: available (codecs: ${Object.keys(codecs).length}, encoders: ${Object.keys(encoders).length})`;
  } catch (error) {
    console.error('Error getting FFmpeg version:', error);
    return 'FFmpeg version: unavailable';
  }
}

ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg.setFfprobePath(ffprobeInstaller.path);

export async function getAudioFileUrl(filename: string): Promise<string> {
  // 检查多个可能的路径
  const possiblePaths = [
    path.join(process.cwd(), 'download', 'mp3', filename),
    path.join(process.cwd(), 'public', 'audio', filename),
    path.join(process.cwd(), 'public', 'uploads', filename)
  ];

  for (const filePath of possiblePaths) {
    console.log('Checking for audio file at:', filePath);
    if (fs.existsSync(filePath)) {
      console.log('Audio file found at:', filePath);
      // 返回相对于公共目录的路径
      return `/audio/${encodeURIComponent(filename)}`;
    }
  }

  console.error('Audio file not found:', filename);
  console.error('Checked paths:', possiblePaths);
  throw new Error(`Audio file not found: ${filename}`);
}
