import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://api.openai-hub.com/v1', // 使用您提供的自定义 URL
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { text, instruction, chatHistory } = req.body;

    if (!text || !instruction) {
      return res.status(400).json({ error: 'Text and instruction are required' });
    }

    try {
      const messages = [
        { role: "system", content: "You are a text processing assistant. Clean and process the given text according to the instructions. Respond only with the processed text, maintaining its original format and structure. Do not add any comments or explanations." },
        ...chatHistory,
        { role: "user", content: `Instruction: ${instruction}\n\nText to process: ${text}` }
      ];

      console.log('Sending request to OpenAI API...');
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: messages,
      });
      console.log('Received response from OpenAI API');

      const cleanedText = response.choices[0].message?.content?.trim() || '';

      // Log the API response for backend visibility
      console.log('API Response:', JSON.stringify(response, null, 2));

      res.status(200).json({ 
        cleanedText,
        message: "处理完成。还有什么我可以帮您的吗？"
      });
    } catch (error) {
      console.error('Error in AI cleaning:', error);
      res.status(500).json({ error: 'Error in AI text cleaning' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
