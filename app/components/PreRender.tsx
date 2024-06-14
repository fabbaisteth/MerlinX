'use client';

import React, { useState, useEffect } from 'react';
import styles from './PreRender.module.css';
import { v4 as uuidv4 } from 'uuid';

interface PreRenderProps {
  initialCode: string;
  onSave: (code: string) => void;
}

interface SavedCode {
  id: string;
  code: string;
}

const PreRender: React.FC<PreRenderProps> = ({ initialCode, onSave }) => {
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
    onSave(code);
  };

  const handleInsertButton = () => {
    const newCode = code.replace('<!-- INSERT BUTTON HERE -->', '<button>New Button</button>');
    setCode(newCode);
  };



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

    </div>
  );
};

export default PreRender;
