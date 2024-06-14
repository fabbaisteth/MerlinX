import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const getImage = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  try {
    const image = await prisma.image.findUnique({
      where: { id: Number(id) },
    });

    if (!image) {
      res.status(404).json({ error: 'Image not found' });
      return;
    }

    res.setHeader('Content-Type', 'image/png');
    res.send(image.data);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving the image' });
  }
};

export default getImage;
