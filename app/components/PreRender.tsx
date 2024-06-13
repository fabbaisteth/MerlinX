'use client';

import React, { useState, useEffect } from 'react';
import HtmlTemplate from './HtmlTemplate';
import styles from './PreRender.module.css';
import { v4 as uuidv4 } from 'uuid';

interface PreRenderProps {
  initialCode: string;
}

interface SavedCode {
  id: string;
  code: string;
}

const PreRender: React.FC<PreRenderProps> = ({ initialCode }) => {
  const [code, setCode] = useState<string>(initialCode);
  const [savedCodes, setSavedCodes] = useState<SavedCode[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);

  useEffect(() => {
    const storedCodes = localStorage.getItem('savedCodes');
    if (storedCodes) {
      setSavedCodes(JSON.parse(storedCodes));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('savedCodes', JSON.stringify(savedCodes));
  }, [savedCodes]);

  useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

  const handleSave = () => {
    const id = uuidv4();
    const newSavedCode = { id, code };
    setSavedCodes([newSavedCode, ...savedCodes]);
    setCurrentPage(0);
  };

  const handleInsertButton = () => {
    const newCode = code.replace('<!-- INSERT BUTTON HERE -->', '<button>New Button</button>');
    setCode(newCode);
  };

  const codesPerPage = 5;
  const startIndex = currentPage * codesPerPage;
  const paginatedCodes = savedCodes.slice(startIndex, startIndex + codesPerPage);

  return (
    <div className={styles.container}>
      <h3>Pre-rendered Code</h3>
      <textarea
        className={styles.codeBlock}
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <button className={styles.saveButton} onClick={handleSave}>
        Save Code
      </button>
      <button className={styles.insertButton} onClick={handleInsertButton}>
        Insert Button
      </button>
      <HtmlTemplate code={code} />
      <div className={styles.pagination}>
        {Array.from({ length: Math.ceil(savedCodes.length / codesPerPage) }, (_, i) => (
          <button key={i} onClick={() => setCurrentPage(i)} disabled={i === currentPage}>
            {i + 1}
          </button>
        ))}
      </div>
      <div className={styles.savedCodes}>
        {paginatedCodes.map((savedCode) => (
          <div key={savedCode.id} className={styles.savedCode}>
            <pre>{savedCode.code}</pre>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PreRender;
