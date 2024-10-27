import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../utils/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      console.log('Connecting to database...');
      const { db } = await connectToDatabase();
      console.log('Connected to database');

      console.log('Fetching audio files...');
      const audioCollection = db.collection('audio_files');
      const audioFiles = await audioCollection.find({}).toArray();
      console.log(`Fetched ${audioFiles.length} audio files`);

      // 确保每个音频文件对象都有 _id 字段
      const audioFilesWithId = audioFiles.map(file => ({
        ...file,
        _id: file._id.toString() // 将 ObjectId 转换为字符串
      }));

      res.status(200).json(audioFilesWithId);
    } catch (error) {
      console.error('Error in audio/list API:', error);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
