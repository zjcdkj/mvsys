import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    const { fileName } = req.query;

    if (!fileName || typeof fileName !== 'string') {
      return res.status(400).json({ error: 'File name is required' });
    }

    try {
      const knowledgeDir = path.join(process.cwd(), 'public', 'knowledge');
      const filePath = path.join(knowledgeDir, fileName);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        res.status(200).json({ message: 'File deleted successfully' });
      } else {
        res.status(404).json({ error: 'File not found' });
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      res.status(500).json({ error: 'Error deleting file' });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
