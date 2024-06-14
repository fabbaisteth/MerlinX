'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './HtmlTemplate.module.css';

interface HtmlTemplateProps {
  savedCodes: Array<{ id: string; code: string }>;
}

const HtmlTemplate: React.FC<HtmlTemplateProps> = ({ savedCodes }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);

  useEffect(() => {
    const doc = iframeRef.current?.contentDocument;
    if (doc && savedCodes.length > 0) {
      const currentCode = savedCodes[currentPage]?.code || '';
      doc.open();
      doc.write(currentCode);
      doc.close();
    }
  }, [currentPage, savedCodes]);

  const totalPages = Math.ceil(savedCodes.length);

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className={styles.container}>
      <h3>HTML Template</h3>
      <iframe ref={iframeRef} className={styles.iframe}></iframe>
      <div className={styles.pagination}>
        <button onClick={handlePrevious} disabled={currentPage === 0}>
          Previous
        </button>
        <span>
          Page {currentPage + 1} of {totalPages}
        </span>
        <button onClick={handleNext} disabled={currentPage === totalPages - 1}>
          Next
        </button>
      </div>
    </div>
  );
};

export default HtmlTemplate;
