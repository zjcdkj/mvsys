import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import ffprobeStatic from '@ffprobe-installer/ffprobe';

ffmpeg.setFfmpegPath(ffmpegStatic as string);
ffmpeg.setFfprobePath(ffprobeStatic.path);

import fs from 'fs';
import path from 'path';
import { Configuration, OpenAIApi } from 'openai';
import { MongoClient } from 'mongodb';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
  basePath: process.env.OPENAI_BASE_URL,
});
const openai = new OpenAIApi(configuration);

const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.error('MONGODB_URI is not defined in the environment variables');
  process.exit(1);
}

console.log('MongoDB URI:', mongoUri); // 添加这行来打印 URI

let mongoClient: MongoClient | null = null;

async function getMongoClient() {
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

export async function processVideo(filePath: string) {
  try {
    // 1. 音频分离
    const audioFile = await extractAudio(filePath);

    // 2. 音频转文本
    const textContent = await convertSpeechToText(audioFile);

    // 3. 文本清洗
    const cleanedText = cleanText(textContent);

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

export async function extractAudio(videoPath: string, onProgress: (progress: number) => void): Promise<string> {
  return new Promise((resolve, reject) => {
    const outputDir = path.join(process.cwd(), 'download', 'mp3');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    const outputPath = path.join(outputDir, `${path.basename(videoPath, '.mp4')}.mp3`);
    
    console.log('Input video path:', videoPath);
    console.log('Output audio path:', outputPath);

    ffmpeg(videoPath)
      .outputOptions('-vn')
      .outputOptions('-acodec', 'libmp3lame')
      .outputOptions('-ac', '2')
      .outputOptions('-b:a', '192k')
      .on('progress', (progress) => {
        if (progress.percent) {
          onProgress(Math.round(progress.percent));
        }
      })
      .on('end', () => {
        console.log('Audio extraction completed:', outputPath);
        resolve(outputPath);
      })
      .on('error', (err) => {
        console.error('Error during audio extraction:', err);
        reject(err);
      })
      .save(outputPath);
  });
}

async function convertSpeechToText(audioFile: string): Promise<string> {
  // 使用OpenAI的Whisper API进行语音识别
  const response = await openai.createTranscription(
    fs.createReadStream(audioFile) as any,
    "whisper-1"
  );
  return response.data.text;
}

function cleanText(text: string): string {
  // 实现文本清洗逻辑
  return text; // 临时返回，实际实现需要清洗文本
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
  // 实现高级分析逻辑
  // 返回分析结果和知识图谱
  return { analysis: "Sample analysis result" }; // 临时返回，实际实现需要进行高级分析
}

export function getAudioDuration(filePath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        console.error('Error in ffprobe:', err);
        reject(err);
      } else {
        resolve(metadata.format.duration || 0);
      }
    });
  });
}
