import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { id, cleanedTranscription } = req.body;

    if (!id || !cleanedTranscription) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      const transcriptionsDir = path.join(process.cwd(), 'download', 'mp3');
      if (!fs.existsSync(transcriptionsDir)) {
        fs.mkdirSync(transcriptionsDir, { recursive: true });
      }
      
      const filePath = path.join(transcriptionsDir, `${id}_cleaned.txt`);

      await fs.promises.writeFile(filePath, cleanedTranscription, 'utf-8');

      res.status(200).json({ message: 'Cleaned transcription saved successfully' });
    } catch (error) {
      console.error('Error saving cleaned transcription:', error);
      res.status(500).json({ error: 'Failed to save cleaned transcription' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
