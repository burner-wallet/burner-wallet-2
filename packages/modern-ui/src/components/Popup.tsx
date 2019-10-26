import React, { Fragment, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const Popup: React.FC<{ anchor: HTMLElement | null }> = ({ anchor, children }) => {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    const _container = document.createElement('div');
    document.body.appendChild(_container);
    setContainer(_container);

    return () => { document.body.removeChild(_container) };
  }, []);

  if (!anchor) {
    return null;
  }

  const { top, left, width, height } = anchor.getBoundingClientRect();

  const popup = (
    <div style={{
      position: 'absolute',
      top: `${top + height}px`,
      left: `${left}px`,
      width: `${width}px`,
    }}>
      {children}
    </div>
  );

  return (
    <Fragment>
      {container && createPortal(popup, container)}
    </Fragment>
  );
};

export default Popup;
