import React from 'react';
import QRCode from 'qrcode.react';
import Page from '../../components/Page';
import TransactionDetails from '../../data-providers/TransactionDetails';

const ReceiptPage: React.FC = ({ match }) => (
  <Page title="Receipt">
    <TransactionDetails
      asset={match.params.asset}
      txHash={match.params.txHash}
      render={(err, tx) => {
        if (err) {
          return `Error: ${err.message}`;
        }
        if (!err && !tx) {
          return 'Loading...';
        }

        return (
          <div>
            <div>From: {tx.from}</div>
            <div>To: {tx.to}</div>
            <div>Value: {tx.displayValue} {tx.assetName}</div>
          </div>
        )
      }}
    />
  </Page>
);

export default ReceiptPage;
