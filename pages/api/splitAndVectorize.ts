import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { ChromaClient } from 'chromadb';
import OpenAI from 'openai';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { fileName, settings } = req.body;

    if (!fileName) {
      return res.status(400).json({ error: 'File name is required' });
    }

    try {
      console.log('Starting process for file:', fileName);

      const knowledgeDir = path.join(process.cwd(), 'public', 'knowledge');
      const filePath = path.join(knowledgeDir, fileName);
      
      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      }

      const content = fs.readFileSync(filePath, 'utf-8');
      console.log('File content length:', content.length);

      const chunks = content.split('\n\n')
        .filter(chunk => chunk.trim() !== '')
        .flatMap(paragraph => {
          const words = paragraph.split(' ');
          const chunks = [];
          for (let i = 0; i < words.length; i += settings.chunkSize - settings.overlap) {
            chunks.push(words.slice(i, i + settings.chunkSize).join(' '));
          }
          return chunks;
        });

      console.log('Number of chunks:', chunks.length);

      console.log('Initializing Chroma client...');
      const chromaDbPath = path.join(process.cwd(), 'data', 'chroma_db');
      console.log('Chroma DB Path:', chromaDbPath);
      const client = new ChromaClient({
        path: process.env.CHROMA_SERVER_URL || 'http://localhost:8000',
        persistDirectory: chromaDbPath  // 添加这一行
      });

      console.log('Initializing OpenAI...');
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      console.log('Creating or getting collection...');
      const collection = await client.getOrCreateCollection({
        name: "knowledge_base",
      });

      console.log('Collection details:', collection);

      console.log('Generating embeddings and adding documents...');
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        console.log(`Processing chunk ${i + 1}/${chunks.length}`);
        const embedding = await openai.embeddings.create({
          model: settings.embeddingModel,
          input: chunk,
        });

        await collection.add({
          ids: [`${fileName}_chunk_${i}`],
          embeddings: embedding.data[0].embedding,
          metadatas: [{ source: fileName }],
          documents: [chunk],
        });
        console.log(`Added chunk ${i + 1} to collection`);
      }

      console.log('Documents added successfully.');
      res.status(200).json({ success: true, message: '入库成功' });
    } catch (error: any) {
      console.error('Error processing file:', error);
      res.status(500).json({ 
        error: 'Error processing file', 
        details: error.message, 
        stack: error.stack,
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
