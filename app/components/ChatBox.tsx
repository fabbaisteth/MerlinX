'use client';

import { useState, KeyboardEvent } from 'react';
import styles from './ChatBox.module.css';

interface ChatBoxProps {
  setCode: (code: string) => void;
}

interface Message {
  text: string;
  isError?: boolean;
}

interface OpenAIMessage {
  role: string;
  content: string | Array<{ type: string; text?: string; image_url?: { url: string } }>;
}

const ChatBox: React.FC<ChatBoxProps> = ({ setCode }) => {
  const [prompt, setPrompt] = useState<string>('');
  const [messages, setMessages] = useState<Array<Message>>([
    { text: 'Hello! How can I help you today?' },
  ]);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GPT_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4-turbo',
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: prompt },
                { type: 'text', text: 'Please turn the design into HTML code, your answer should contain only html code and tstart with <html> tag and end with </html> tag.' },
                {
                  type: 'image_url',
                  image_url: { url: 'https://res.cloudinary.com/dyc96l5su/image/upload/v1718269072/v0gx0kcvzqz4ryke7qkd.png' },
                },
              ],
            },
          ],
          max_tokens: 300,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      const openAIResponse = data.choices[0].message?.content || '';

      setCode(openAIResponse);

      // Add the new message to the chat
      setMessages([...messages, { text: prompt }]);
      setPrompt('');
      setError(null);
    } catch (err: any) {
      setMessages([...messages, { text: prompt, isError: true }]);
      setError(err.message || 'Failed to send message. Please try again.');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.messages}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`${styles.message} ${message.isError ? styles.errorMessage : ''}`}
          >
            {message.text}
          </div>
        ))}
        {error && <div className={styles.error}>{error}</div>}
      </div>
      <textarea
        className={styles.textarea}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter your prompt"
      />
      <button className={styles.button} onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
};

export default ChatBox;
