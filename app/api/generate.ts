import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.GPT_API_KEY });

type Data = {
  code: string;
};


export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === 'POST') {
    try {
      const { prompt } = req.body;

      if (!prompt) {
        res.status(400).json({ code: 'No prompt provided' });
        return;
      }

      // Call the OpenAI API with the prompt
      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo',
        messages: [
          {
            role: 'user',
            content: 'say hello to the world',
          },
        ],
        max_tokens: 300,
      });

      const code = response.choices[0].message?.content || '';

      res.status(200).json({ code });
    } catch (error) {
      console.error('Error interacting with OpenAI API:', error);
      res.status(500).json({ code: 'An error occurred while processing your request.' });
    }
  } else {
    res.status(405).end();
  }
}
