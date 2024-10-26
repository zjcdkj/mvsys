import { NextApiRequest, NextApiResponse } from 'next';
import { ChromaClient } from 'chromadb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { fileName } = req.query;

    if (!fileName || typeof fileName !== 'string') {
      return res.status(400).json({ error: 'File name is required' });
    }

    try {
      const client = new ChromaClient({
        path: process.env.CHROMA_SERVER_URL || 'http://localhost:8000',
      });

      const collection = await client.getCollection({
        name: "knowledge_base",
      });

      const chunks = await collection.get({
        where: { source: fileName },
        limit: 10, // 限制返回的块数，以避免响应过大
      });

      const chunkPreviews = chunks.ids.map((id, index) => ({
        id,
        content: chunks.documents[index],
      }));

      res.status(200).json(chunkPreviews);
    } catch (error) {
      console.error('Error fetching chunks:', error);
      res.status(500).json({ error: 'Error fetching chunks' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
