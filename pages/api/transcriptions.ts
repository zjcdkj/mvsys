import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const transcriptionsDir = path.join(process.cwd(), 'download', 'mp3');
      const files = fs.readdirSync(transcriptionsDir);
      
      const transcriptions = files
        .filter(file => file.endsWith('.txt') && !file.endsWith('_cleaned.txt'))
        .map(file => {
          const id = path.basename(file, '.txt');
          const audioName = `${id}.mp3`;
          const transcription = fs.readFileSync(path.join(transcriptionsDir, file), 'utf-8');
          
          let cleanedTranscription = '';
          const cleanedFilePath = path.join(transcriptionsDir, `${id}_cleaned.txt`);
          if (fs.existsSync(cleanedFilePath)) {
            cleanedTranscription = fs.readFileSync(cleanedFilePath, 'utf-8');
          }
          
          return {
            id,
            audioName,
            transcription,
            cleanedTranscription,
          };
        });

      res.status(200).json(transcriptions);
    } catch (error) {
      console.error('Error fetching transcriptions:', error);
      res.status(500).json({ error: 'Failed to fetch transcriptions' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
