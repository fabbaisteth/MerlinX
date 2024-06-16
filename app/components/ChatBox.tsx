'use client';

import { useState, KeyboardEvent, ChangeEvent } from 'react';
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
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [messages, setMessages] = useState<Array<Message>>([
    { text: 'Hello! How can I help you today?' },
  ]);
  const [prevCode, setPrevCode] = useState<string>(''); // Store the previous code
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<string | null>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const uploadImageToServer = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const data = await response.json();
    // setResponse(data);
    setImageUrl(data.fileName.imageUrl);
    console.log(data.fileName.imageUrl);
    return data.fileName.imageUrl; // Assuming the API returns the file URL
  };

  const handleSubmit = async () => {

    if (image) {
      try {
        const imageUrl = await uploadImageToServer(image);
        setImageUrl(imageUrl);
        setError(null);
        const content = [
          ...(prevCode ? [{ type: 'text', text: prevCode }] : []),
          { type: 'text', text: prompt },
          ...(imageUrl ? [{ type: 'image_url', image_url: { url: imageUrl } }] : []),
        ];

        const openAIMessages: OpenAIMessage[] = [
          {
            role: 'system',
            content:
              `You are an experienced web developer and can quickly generate valid HTML, CSS and JAVASCRIPT.
             I want you to help me write a single HTML file that includes any required CSS and javascript to make the file render a valid and useable website. 
             I will provide instructions that describe the website that i want you to help me produce. 
             i will also include html of the website that i currently have and your job will be to refelct on the "current" HTML plus the provided instructions and return an updated HTML file. 
             Return ONLY the file as a code block with nothing else. Your output needs to be valid HTML (including any required CSS and javascript) ONLY. 
             Exclude any markdown or code markers in your response. Pick colours and fonts that reflect any instructions provided.`
          },
          {
            role: 'user',
            content,
          },
        ];

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GPT_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'gpt-4-turbo',
            messages: openAIMessages,
            max_tokens: 2000,
          }),
        });

        if (!response.ok) {
          throw new Error(`OpenAI API error: ${response.statusText}`);
        }

        const data = await response.json();
        const openAIResponse = data.choices[0].message?.content || '';

        setPrevCode(openAIResponse);
        setCode(openAIResponse);

        // Add the new message to the chat
        setMessages([...messages, { text: prompt }]);
        setPrompt('');
        setImage(null);
        setImageUrl(null);
        setError(null);
      } catch (err: any) {
        setMessages([...messages, { text: prompt, isError: true }]);
        setError(err.message || 'Failed to send message. Please try again.');
      }
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
      <div className={styles.inputbuttons}>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        <div className={styles.buttonContainer}>

          <button className={styles.button} onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
      {imageUrl && (
        <div className={styles.preview}>
          <h3>Preview:</h3>
          <img src={imageUrl} alt="Uploaded Preview" className={styles.imagePreview} />
        </div>
      )}
      {response && (
        <div className={styles.response}>
          <h4>OpenAI Response:</h4>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
};

export default ChatBox;
