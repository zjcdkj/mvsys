import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../../utils/database';
import fs from 'fs';
import path from 'path';
import { ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid audio file ID' });
    }

    try {
      const { db } = await connectToDatabase();
      const collection = db.collection('audio_files');

      // 尝试将 id 转换为 ObjectId，如果失败则使用原始字符串
      let objectId;
      try {
        objectId = new ObjectId(id);
      } catch (error) {
        console.warn('Invalid ObjectId, using original string:', id);
        objectId = id;
      }

      // 查找音频文件
      const audioFile = await collection.findOne({ _id: objectId });

      if (!audioFile) {
        return res.status(404).json({ error: 'Audio file not found in database' });
      }

      // 删除文件系统中的音频文件
      const filePath = path.join(process.cwd(), 'public', 'audio', audioFile.name);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      // 从数据库中删除记录
      await collection.deleteOne({ _id: objectId });

      res.status(200).json({ success: true, message: 'Audio file deleted successfully' });
    } catch (error) {
      console.error('Error deleting audio file:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
