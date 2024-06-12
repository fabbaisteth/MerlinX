import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Setup Multer for file handling
const upload = multer({ dest: 'uploads/' }); // Files will be saved in the 'uploads' directory

const apiRoute = nextConnect({
  onError(error, req, res) {
    res.status(501).json({ error: `Something went wrong! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(upload.single('file'));

apiRoute.post(async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Save the file to the server
    const targetPath = path.join(process.cwd(), 'uploads', file.originalname);
    fs.renameSync(file.path, targetPath);

    const fileUrl = `/uploads/${file.originalname}`;

    res.status(200).json({ url: fileUrl });
  } catch (error) {
    console.error('File upload error:', error); // Log error for debugging
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

export { apiRoute as POST };

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, use Multer instead
  },
};
