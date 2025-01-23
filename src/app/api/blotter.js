import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const handler = async (req, res) => {
  if (req.method === 'POST') {
    const { type, description, address, fullName, idPicture, userId } = req.body;

    if (!type || !description || !address || !fullName || !idPicture || !userId) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    try {
      const newBlotterEntry = await prisma.blotter.create({
        data: {
          type,
          description,
          address,
          fullName,
          idPicture,
          userId,
        },
      });
      return res.status(201).json(newBlotterEntry);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to create blotter entry' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;