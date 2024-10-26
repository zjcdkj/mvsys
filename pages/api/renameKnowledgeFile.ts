import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { oldName, newName } = req.body;

    if (!oldName || !newName) {
      return res.status(400).json({ error: 'Old name and new name are required' });
    }

    try {
      const knowledgeDir = path.join(process.cwd(), 'public', 'knowledge');
      const oldPath = path.join(knowledgeDir, oldName);
      const newPath = path.join(knowledgeDir, newName);

      if (fs.existsSync(oldPath)) {
        fs.renameSync(oldPath, newPath);
        res.status(200).json({ message: 'File renamed successfully' });
      } else {
        res.status(404).json({ error: 'File not found' });
      }
    } catch (error) {
      console.error('Error renaming file:', error);
      res.status(500).json({ error: 'Error renaming file' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
