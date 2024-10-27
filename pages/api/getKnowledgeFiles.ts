import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { connectToDatabase } from '../../utils/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { db } = await connectToDatabase();
      const knowledgeDir = path.join(process.cwd(), 'public', 'knowledge');
      const files = fs.readdirSync(knowledgeDir);

      const fileInfo = files.map(file => {
        const filePath = path.join(knowledgeDir, file);
        const stats = fs.statSync(filePath);
        const content = fs.readFileSync(filePath, 'utf-8');
        return {
          name: file,
          size: stats.size,
          wordCount: content.split(/\s+/).length,
          createdAt: stats.birthtime.toISOString()
        };
      });

      res.status(200).json(fileInfo);
    } catch (error) {
      console.error('Error getting knowledge files:', error);
      res.status(500).json({ error: 'Error getting knowledge files' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
