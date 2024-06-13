'use client';

import { useState } from 'react';
import ChatBox from './components/ChatBox';
import PreRender from './components/PreRender';
import HtmlTemplate from './components/HtmlTemplate';
import Header from './components/Header';

const Page = () => {
  const [code, setCode] = useState<string>('');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header />
      <div style={{ display: 'flex', flexGrow: 1 }}>
        <div style={{ flex: 1, borderRight: '1px solid #ccc' }}>
          <ChatBox setCode={setCode} />
        </div>
        <div style={{ flex: 2, borderRight: '1px solid #ccc', padding: '20px' }}>
          <HtmlTemplate code={code} />
        </div>
        <div style={{ flex: 1, padding: '20px' }}>
          <PreRender initialCode={code} />
        </div>
      </div>
    </div>
  );
};

export default Page;
