import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../../utils/database';
import fs from 'fs';
import path from 'path';
import { ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ success: false, error: 'Invalid audio file ID' });
    }

    try {
      const { db } = await connectToDatabase();
      const collection = db.collection('audio_files');

      // Find the audio file in the database
      const audioFile = await collection.findOne({ _id: new ObjectId(id) });

      if (!audioFile) {
        return res.status(404).json({ success: false, error: 'Audio file not found in database' });
      }

      // Delete the file from the filesystem
      const filePath = path.join(process.cwd(), 'public', 'audio', audioFile.name);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      // Remove the file entry from the database
      await collection.deleteOne({ _id: new ObjectId(id) });

      res.status(200).json({ success: true, message: 'Audio file deleted successfully' });
    } catch (error) {
      console.error('Error deleting audio file:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
