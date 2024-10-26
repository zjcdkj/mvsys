import { NextApiRequest, NextApiResponse } from 'next';
import { ChromaClient, OpenAIEmbeddingFunction } from 'chromadb';
import OpenAI from 'openai';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { chunks } = req.body;

    if (!chunks || !Array.isArray(chunks)) {
      return res.status(400).json({ error: 'Invalid chunks data' });
    }

    try {
      const chromaDbPath = path.join(process.cwd(), 'data', 'chroma_db');
      const client = new ChromaClient({
        path: process.env.CHROMA_SERVER_URL || 'http://localhost:8000',
        persistDirectory: chromaDbPath
      });

      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      const embedder = new OpenAIEmbeddingFunction({
        openai_api_key: process.env.OPENAI_API_KEY || '',
        model_name: "text-embedding-ada-002"
      });

      const collection = await client.getCollection({
        name: "knowledge_base",
        embeddingFunction: embedder
      });

      // 更新每个chunk
      for (const chunk of chunks) {
        const embedding = await openai.embeddings.create({
          model: "text-embedding-ada-002",
          input: chunk.content,
        });

        await collection.update({
          ids: [chunk.id],
          embeddings: [embedding.data[0].embedding],
          documents: [chunk.content],
        });
      }

      res.status(200).json({ message: 'Chunks updated successfully' });
    } catch (error) {
      console.error('Error saving chunks:', error);
      res.status(500).json({ error: 'Error saving chunks' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
