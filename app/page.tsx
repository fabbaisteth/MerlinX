'use client';

import { useState } from 'react';
import ChatBox from './components/ChatBox';
import PreRender from './components/PreRender';
import HtmlTemplate from './components/HtmlTemplate';
import Header from './components/Header';
import { v4 as uuidv4 } from 'uuid';

const Page = () => {
  const [code, setCode] = useState<string>('');
  const [savedCodes, setSavedCodes] = useState<Array<{ id: string; code: string }>>([]);

  const handleSaveCode = (newCode: string) => {
    const newSavedCode = { id: uuidv4(), code: newCode };
    setSavedCodes((prevCodes) => [newSavedCode, ...prevCodes]);
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header />
      <div style={{ display: 'flex', flexGrow: 1 }}>
        <div style={{ flex: 1, borderRight: '1px solid #ccc' }}>
          <ChatBox setCode={setCode} />
        </div>
        <div style={{ flex: 3, padding: '20px' }}>
          <HtmlTemplate savedCodes={savedCodes} />
        </div>
        <PreRender initialCode={code} onSave={handleSaveCode} />

      </div>
    </div>
  );
};

export default Page;
