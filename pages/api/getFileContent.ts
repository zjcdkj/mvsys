import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { fileName } = req.query;

    if (!fileName || typeof fileName !== 'string') {
      return res.status(400).json({ error: 'File name is required' });
    }

    try {
      const knowledgeDir = path.join(process.cwd(), 'public', 'knowledge');
      const filePath = path.join(knowledgeDir, fileName);

      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        res.status(200).json({ content });
      } else {
        res.status(404).json({ error: 'File not found' });
      }
    } catch (error) {
      console.error('Error reading file:', error);
      res.status(500).json({ error: 'Error reading file' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
