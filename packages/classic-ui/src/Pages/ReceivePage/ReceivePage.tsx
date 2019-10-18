import React, { Fragment, useState } from 'react';
import injectSheet from 'react-jss';
import QRCode from 'qrcode.react';
import { BurnerContext, withBurner } from '@burner-wallet/ui-core';
import Page from '../../components/Page';

const styles = {
  qrContainer: {
    textAlign: 'center',
    border: 'solid 10px #f2f2f2',
    background: '#f2f2f2',
    '& svg': {
      width: '100%',
      height: 'initial',
      maxWidth: '600px',
      maxHeight: '60vh',
    },
  },
  addressContainer: {
    margin: '10px 40px',
  },
  address: {
    width: '100%',
    fontSize: 18,
    color: '#999999',
    padding: '6px 12px',
  },
  copyHidden: {
    opacity: 0,
    transition: 'all 1s',
    textAlign: 'center',
  },
  copied: {
    opacity: 1,
    transition: 'all 1s',
    textAlign: 'center',
  },
};

const ReceivePage: React.FC<BurnerContext & { classes: any }> = ({ defaultAccount, classes }) => {
  const [showCopied, setShowCopied] = useState(false);
  return (
    <Page title="Receive">
      <div className={classes.qrContainer}>
        <QRCode value={defaultAccount} renderAs="svg" />
      </div>
      <div className={classes.addressContainer}>
        <input
          value={defaultAccount}
          readOnly
          className={classes.address}
          onClick={() => {
            navigator.clipboard.writeText(defaultAccount);
            setShowCopied(true);
            setTimeout(() => setShowCopied(false), 5000);
          }}
        />
      </div>
      <div className={showCopied ? classes.copied : classes.copyHidden}>
        Address copied to clipboard
      </div>
    </Page>
  );
};

export default injectSheet(styles)(withBurner(ReceivePage));
