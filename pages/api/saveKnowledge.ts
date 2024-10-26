import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { fileName, content } = req.body;

    if (!fileName || !content) {
      return res.status(400).json({ error: 'File name and content are required' });
    }

    try {
      const knowledgeDir = path.join(process.cwd(), 'public', 'knowledge');
      if (!fs.existsSync(knowledgeDir)) {
        fs.mkdirSync(knowledgeDir, { recursive: true });
      }

      const filePath = path.join(knowledgeDir, `${fileName}.txt`);
      fs.writeFileSync(filePath, content);

      res.status(200).json({ message: 'File saved successfully' });
    } catch (error) {
      console.error('Error saving file:', error);
      res.status(500).json({ error: 'Error saving file' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
