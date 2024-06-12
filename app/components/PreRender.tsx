'use client';

import React from 'react';
import styles from './PreRender.module.css';
import { v4 as uuidv4 } from 'uuid';

interface PreRenderProps {
  code: string;
  onSave: (code: string) => void;
}

const PreRender: React.FC<PreRenderProps> = ({ code, onSave }) => {
  const handleSave = async () => {
    const id = uuidv4();
    await fetch('/api/save-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, code }),
    });

    onSave(code);
  };

  return (
    <div className={styles.container}>
      <h3>Pre-rendered Code</h3>
      <pre className={styles.codeBlock}>{code}</pre>
      <button className={styles.saveButton} onClick={handleSave}>
        Save Code
      </button>
    </div>
  );
};

export default PreRender;
