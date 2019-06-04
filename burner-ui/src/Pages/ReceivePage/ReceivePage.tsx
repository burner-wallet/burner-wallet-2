import React from 'react';
import QRCode from 'qrcode.react';
import { BurnerContext } from '../../BurnerProvider';
import Page from '../../components/Page';
import classes from './ReceivePage.module.css';

const ReceivePage: React.FC = ({ accounts }: BurnerContext) => (
  <Page title="Receive">
    {accounts.length > 0 && (
      <>
        <div className={classes.qrContainer}>
          <QRCode value={accounts[0]} renderAs="svg" className={classes.qrCode} />
        </div>
        <div className={classes.addressContainer}>
          <input value={accounts[0]} readOnly className={classes.address} />
        </div>
      </>
    )}
  </Page>
);

export default ReceivePage;
