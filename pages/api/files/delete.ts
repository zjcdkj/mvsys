import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../utils/database';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    const { filename } = req.query;

    if (!filename || typeof filename !== 'string') {
      return res.status(400).json({ error: 'Invalid filename' });
    }

    try {
      const { db } = await connectToDatabase();
      const collection = db.collection('video_files');

      // Find the file in the database
      const file = await collection.findOne({ name: filename });

      if (!file) {
        return res.status(404).json({ error: 'File not found in database' });
      }

      // Delete the file from the filesystem
      const filePath = path.join(process.cwd(), 'public', 'uploads', filename);
      fs.unlinkSync(filePath);

      // Remove the file entry from the database
      await collection.deleteOne({ name: filename });

      res.status(200).json({ message: 'File deleted successfully' });
    } catch (error) {
      console.error('Error deleting file:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
