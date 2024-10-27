import { NextApiRequest, NextApiResponse } from 'next';
import { convertSpeechToText } from '../../utils/videoProcessor';
import { connectToDatabase } from '../../utils/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { filename } = req.body;

    if (!filename) {
      return res.status(400).json({ error: 'Filename is required' });
    }

    try {
      const { db } = await connectToDatabase();
      const collection = db.collection('audio_files');

      // 更新转录状态为 "transcribing"
      await collection.updateOne({ name: filename }, { $set: { transcriptionStatus: 'transcribing', transcriptionProgress: 0 } });

      // 使用 SSE 来实时更新进度
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      });

      const sendProgress = (progress: number) => {
        res.write(`data: ${JSON.stringify({ progress })}\n\n`);
      };

      const transcription = await convertSpeechToText(filename, sendProgress);

      // 更新转录状态为 "transcribed" 并保存转录文本
      await collection.updateOne(
        { name: filename },
        { $set: { transcriptionStatus: 'transcribed', transcription: transcription, transcriptionProgress: 100 } }
      );

      res.write(`data: ${JSON.stringify({ complete: true })}\n\n`);
      res.end();
    } catch (error) {
      console.error('Error in transcription:', error);
      res.status(500).json({ error: 'Error during transcription process', details: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
