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

const ChatBox: React.FC<ChatBoxProps> = ({ setCode }) => {
  const [prompt, setPrompt] = useState<string>('');
  const [messages, setMessages] = useState<Array<Message>>([
    { text: 'Hello! How can I help you today?' },
  ]);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    console.log(process.env.NEXT_PUBLIC_GPT_API_KEY);
    try {
      const content = [
        { type: 'text', text: prompt },
      ];

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GPT_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4-turbo',
          messages: [
            {
              role: 'user',
              content,
            },
          ],
          max_tokens: 300,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      setCode(data.choices[0].message?.content || '');

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
