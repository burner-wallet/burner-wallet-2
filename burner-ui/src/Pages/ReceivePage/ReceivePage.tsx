import React from 'react';
import QRCode from 'qrcode.react';
import { BurnerContext } from '../../BurnerProvider';

const ReceivePage: React.FC = ({ accounts }: BurnerContext) => (
  <div>
    {accounts.length > 0 && (
      <>
        <QRCode value={accounts[0]} />
        <input value={accounts[0]} readOnly />
      </>
    )}
  </div>
);

export default ReceivePage;
