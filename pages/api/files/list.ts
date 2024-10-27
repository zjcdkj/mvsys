import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../utils/database';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { db } = await connectToDatabase();
      const videoCollection = db.collection('video_files');
      const dbVideoFiles = await videoCollection.find({}).toArray();

      const videoFiles = dbVideoFiles.map(file => ({
        id: file._id.toString(),
        name: file.name,
        size: file.size,
        uploadedAt: file.uploadDate,
      }));

      res.status(200).json(videoFiles);
    } catch (error) {
      console.error('Error fetching video files:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
