import { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, OpenAIApi } from 'openai';
import { MongoClient } from 'mongodb';
import { promises as fsPromises } from 'fs';

// 确保这个环境变量已经设置
if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

// 创建 OpenAIApi 实例时不要设置 basePath
const openai = new OpenAIApi(configuration);

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function connectToDatabase() {
  if (!client.isConnected()) await client.connect();
  return client.db('your_database_name');
}

// 如果您需要使用自定义 URL，可以在每次请求时覆盖
const customFetch = async (url: string, options: RequestInit) => {
  const baseUrl = 'https://api.openai-hub.com/v1';
  return fetch(`${baseUrl}${url}`, options);
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    try {
      // Generate embedding for the query
      const embeddingResponse = await openai.createEmbedding({
        model: "text-embedding-ada-002",
        input: query,
      });
      const queryEmbedding = embeddingResponse.data.data[0].embedding;

      // Search for similar texts in MongoDB
      const db = await connectToDatabase();
      const collection = db.collection('cleaned_texts');
      const results = await collection.aggregate([
        {
          $search: {
            index: "default",
            knnBeta: {
              vector: queryEmbedding,
              path: "embedding",
              k: 5
            }
          }
        },
        {
          $project: {
            text: 1,
            score: { $meta: "searchScore" }
          }
        }
      ]).toArray();

      res.status(200).json({ 
        results: results.map(r => r.text),
        message: "搜索完成。"
      });
    } catch (error) {
      console.error('Error in search:', error);
      res.status(500).json({ error: 'Error in search' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
