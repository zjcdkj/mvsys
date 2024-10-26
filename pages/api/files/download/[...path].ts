import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { path: filePath } = req.query;
  const fullPath = path.join(process.cwd(), 'uploads', ...(filePath as string[]));

  if (fs.existsSync(fullPath)) {
    const fileStream = fs.createReadStream(fullPath);
    res.setHeader('Content-Disposition', `attachment; filename=${path.basename(fullPath)}`);
    fileStream.pipe(res);
  } else {
    res.status(404).json({ error: 'File not found' });
  }
}
