import { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { promisify } from 'util';
import fs from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Setup Multer for file handling
const upload = multer({ dest: 'uploads/' });

const uploadMiddleware = upload.single('file');

const runMiddleware = (req: NextApiRequest, res: NextApiResponse, fn: Function) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, use Multer instead
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  }

  try {
    await runMiddleware(req, res, uploadMiddleware);

    const file = (req as any).file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Upload the file to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(file.path, {
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    });

    // Clean up the uploaded file from the server
    await promisify(fs.unlink)(file.path);

    res.status(200).json({ url: uploadResult.secure_url });
  } catch (error) {
    console.error('File upload error:', error); // Log error for debugging
    res.status(500).json({ error: 'Failed to upload image' });
  }
}
