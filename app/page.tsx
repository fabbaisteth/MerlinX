'use client';

import { useState, useEffect } from 'react';
import ChatBox from './components/ChatBox';
import PreRender from './components/PreRender';
import HtmlTemplate from './components/HtmlTemplate';
import Header from './components/Header';

const Page = () => {
  const [code, setCode] = useState<string>('');
  const [savedCode, setSavedCode] = useState<string>('');

  const handleCodeSave = (newCode: string) => {
    setSavedCode(newCode);
  };

  useEffect(() => {
    const fetchSavedCodes = async () => {
      const response = await fetch('/api/save-code');
      const data = await response.json();
      if (data.length > 0) {
        setSavedCode(data[data.length - 1].code); // Load the last saved code on initial load
      }
    };

    fetchSavedCodes();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header />
      <div style={{ display: 'flex', flexGrow: 1 }}>
        <div style={{ flex: 1, borderRight: '1px solid #ccc' }}>
          <ChatBox setCode={setCode} />
        </div>
        <div style={{ flex: 2, borderRight: '1px solid #ccc', padding: '20px' }}>
          <HtmlTemplate code={savedCode} />
        </div>
        <div style={{ flex: 1, padding: '20px' }}>
          <PreRender code={code} onSave={handleCodeSave} />
        </div>
      </div>
    </div>
  );
};

export default Page;
