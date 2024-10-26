import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import { convertSpeechToText, cleanText } from '../../utils/videoProcessor';
import { promises as fsPromises } from 'fs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { filename } = req.body;
    
    if (!filename) {
      return res.status(400).json({ error: 'Filename is required' });
    }

    try {
      const audioPath = path.join(process.cwd(), 'download', 'mp3', filename);
      const transcription = await convertSpeechToText(audioPath);
      const cleanedTranscription = await cleanText(transcription);

      // 保存清洗后的文本
      const cleanedTxtFilePath = audioPath.replace('.mp3', '_cleaned.txt');
      await fsPromises.writeFile(cleanedTxtFilePath, cleanedTranscription, 'utf-8');

      res.status(200).json({ success: true, message: 'Transcription completed' });
    } catch (error) {
      console.error('Error in transcription:', error);
      res.status(500).json({ error: 'Transcription failed' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
