import React, { useRef, useState, Fragment } from 'react';
import injectSheet from 'react-jss';
import QrReader from 'react-qr-reader';
import { withBurner, BurnerContext } from '../BurnerProvider';

const style = (theme: any) => ({
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    padding: 15,
    display: 'flex',
    flexDirection: 'column',
    zIndex: 100,
  },
  instruction: {
    textAlign: 'center',
    color: '#EEEEEE',
    fontSize: 16,
    marginTop: 16,
  },
  cameraIconContainer: {
    display: 'flex',
    height: 100,
  },
  cameraIcon: {
    flex: 1,
  },
  readerContainer: {
    overflow: 'hidden',
  },
  reader: {
    flex: '1 0',
  },
});

const Scanner: React.FC<BurnerContext & { classes: any }> = ({ children, completeScan, classes }) => {
  const reader = useRef<any>(null);
  const [fallback, setFallback] = useState(false);

  if (!completeScan) {
    return null;
  }

  return (
    <div className={classes.overlay}>
      <button type="button" onClick={() => completeScan(null)}>Close</button>

      {fallback && (
        <Fragment>
          <div className={classes.instruction}>Take a photo of a QR code</div>
          <div className={classes.cameraIconContainer} onClick={() => reader.current!.openImageDialog()}>
            <svg className={classes.cameraIcon} viewBox="0 0 24 24">
              <path fill="#ffffff" d="M4,4H7L9,2H15L17,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9Z" />
            </svg>
          </div>
        </Fragment>
      )}

      <div className={classes.readerContainer}>
        <QrReader
          delay={300}
          ref={reader}
          legacyMode={fallback}
          className={classes.reader}
          onError={err => {
            console.error(err);
            setFallback(true);
          }}
          onScan={address => {
            if (address) {
              completeScan(address);
            }
          }}
        />
      </div>
    </div>
  );
};

export default injectSheet(style)(withBurner(Scanner));
