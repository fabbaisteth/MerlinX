import { useEffect, useRef } from 'react';
import styles from './HtmlTemplate.module.css';

interface HtmlTemplateProps {
  code: string;
}

const HtmlTemplate: React.FC<HtmlTemplateProps> = ({ code }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const doc = iframeRef.current?.contentDocument;
    if (doc) {
      doc.open();
      doc.write(code);
      doc.close();
    }
  }, [code]);

  return (
    <div className={styles.container}>
      <h3>HTML Template</h3>
      <iframe ref={iframeRef} style={{ width: '100%', height: '100%' }}></iframe>
    </div>
  );
};

export default HtmlTemplate;
