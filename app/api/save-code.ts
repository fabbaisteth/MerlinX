import type { NextApiRequest, NextApiResponse } from 'next';

let savedCodes: { id: string; code: string }[] = [];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { id, code } = req.body;
    savedCodes.push({ id, code });
    res.status(200).json({ message: 'Code saved successfully' });
  } else if (req.method === 'GET') {
    res.status(200).json(savedCodes);
  } else {
    res.status(405).end();
  }
}
