import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { path: filePath } = req.query;

  if (typeof filePath === 'string' || !filePath) {
    return res.status(400).json({ error: 'Invalid file path' });
  }

  const fullPath = path.join(process.cwd(), 'download', ...filePath);
  console.log('Attempting to serve file:', fullPath); // 添加日志

  if (fs.existsSync(fullPath)) {
    const stat = fs.statSync(fullPath);
    res.writeHead(200, {
      'Content-Type': 'audio/mpeg',
      'Content-Length': stat.size
    });
    const readStream = fs.createReadStream(fullPath);
    readStream.pipe(res);
  } else {
    console.error('File not found:', fullPath); // 添加错误日志
    res.status(404).json({ error: 'File not found' });
  }
}
