'use client';

import React, { useState, useEffect, Suspense } from 'react';
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

  return (
    <div className={styles.container}>
      <h3 className='mb-5'>Pre-rendered Code</h3>
      <textarea
        className={styles.codeBlock}
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <button className={styles.saveButton} onClick={handleSave}>
        Save Code
      </button>
    </div>
  );
};

export default PreRender;
