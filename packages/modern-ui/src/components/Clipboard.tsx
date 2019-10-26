import React, { useState, useEffect, useRef, ReactNode } from 'react';
import ClipboardJS from 'clipboard';

interface ClipboardProps {
  text: string;
  children: (isCopied: boolean) => ReactNode;
}

const Clipboard: React.FC<ClipboardProps> = ({ text, children }) => {
  const [isCopied, setIsCopied] = useState(false);
  const targetEl = useRef<HTMLDivElement | null>(null);
  const timer = useRef(0);

  useEffect(() => {
    if (targetEl.current) {
      const afterCopy = () => {
        setIsCopied(true);
        clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setIsCopied(false), 1500);
      };

      const clipboard = new ClipboardJS(targetEl.current, { text: () => text });

      clipboard.on('success', () => afterCopy());
      clipboard.on('error', (e: Error) => console.error('error: failed to copy text', e));

      return () => {
        clipboard.destroy();
        clearTimeout(timer.current);
      };
    }
  }, [targetEl.current]);

  return <div ref={targetEl}>{children(isCopied)}</div>;
};

export default Clipboard;
