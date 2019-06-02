import React from 'react';
import QRCode from 'qrcode.react';
import { BurnerContext } from '../../BurnerProvider';
import Page from '../../components/Page';

const ReceivePage: React.FC = ({ accounts }: BurnerContext) => (
  <Page title="Receive">
    {accounts.length > 0 && (
      <>
        <QRCode value={accounts[0]} />
        <input value={accounts[0]} readOnly />
      </>
    )}
  </Page>
);

export default ReceivePage;
