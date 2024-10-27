import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { connectToDatabase } from '../../../utils/database';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    console.log('Upload directory:', uploadDir);

    if (!fs.existsSync(uploadDir)) {
      console.log('Creating upload directory');
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const form = formidable({
      uploadDir: uploadDir,
      keepExtensions: true,
      maxFileSize: 200 * 1024 * 1024, // 200MB
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Error parsing form:', err);
        return res.status(500).json({ error: 'Error uploading file', details: err.message });
      }

      console.log('Parsed files:', JSON.stringify(files, null, 2));

      const file = Array.isArray(files.file) ? files.file[0] : files.file;
      if (!file) {
        console.error('No file uploaded');
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const oldPath = file.filepath;
      const newPath = path.join(uploadDir, file.originalFilename || 'uploaded_file');

      console.log('Old path:', oldPath);
      console.log('New path:', newPath);

      try {
        fs.renameSync(oldPath, newPath);
        console.log('File successfully renamed and moved');

        // Save file info to MongoDB
        const { db } = await connectToDatabase();
        const collection = db.collection('video_files');
        await collection.insertOne({
          name: path.basename(newPath),
          size: file.size,
          uploadDate: new Date(),
          path: newPath
        });

        res.status(200).json({ message: 'File uploaded successfully', filename: path.basename(newPath) });
      } catch (error: any) {
        console.error('Error saving file or database entry:', error);
        return res.status(500).json({ error: 'Error saving file or database entry', details: error.message });
      }
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
