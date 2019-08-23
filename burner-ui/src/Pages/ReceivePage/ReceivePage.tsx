import React, { useState } from 'react';
import QRCode from 'qrcode.react';
import { BurnerContext, withBurner } from '../../BurnerProvider';
import Page from '../../components/Page';
const classes = require('./ReceivePage.module.css');

const ReceivePage: React.FC<BurnerContext> = ({ accounts }) => {
  const [showCopied, setShowCopied] = useState(false);
  return (
    <Page title="Receive">
      {accounts.length > 0 && (
        <>
          <div className={classes.qrContainer}>
            <QRCode value={accounts[0]} renderAs="svg" />
          </div>
          <div className={classes.addressContainer}>
            <input
              value={accounts[0]}
              readOnly
              className={classes.address}
              onClick={() => {
                navigator.clipboard.writeText(accounts[0]);
                setShowCopied(true);
                setTimeout(() => setShowCopied(false), 5000);
              }}
            />
          </div>
          <div className={showCopied ? classes.copied : classes.copyHidden}>
            Address copied to clipboard
          </div>
        </>
      )}
    </Page>
  );
};

export default withBurner(ReceivePage);
