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
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);

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

  useEffect(() => {
    if (code.trim() !== '') {
      const id = uuidv4();
      const newSavedCode = { id, code };
      setSavedCodes([newSavedCode, ...savedCodes]);
      onSave(code);
    }
  }, [code, onSave, savedCodes]);



  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      <button className={styles.collapseButton} onClick={toggleCollapse}>
        {isCollapsed ? 'Show code' : 'Collapse code'}
      </button>
      <div className={`${styles.container} ${isCollapsed ? styles.collapsed : ''}`}>
        <h3 className='mb-5 font-semibold'>Pre-rendered Code</h3>
        <textarea
          className={styles.codeBlock}
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
      </div>
    </>
  );
};

export default PreRender;
