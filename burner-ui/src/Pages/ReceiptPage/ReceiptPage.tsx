import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import QRCode from 'qrcode.react';
import Page from '../../components/Page';
import TransactionDetails from '../../data-providers/TransactionDetails';

interface MatchParams {
  asset: string;
  txHash: string;
}

const ReceiptPage: React.FC<RouteComponentProps<MatchParams>> = ({ match }) => (
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
            {tx.message && (
              <div>Message: {tx.message}</div>
            )}
          </div>
        )
      }}
    />
  </Page>
);

export default ReceiptPage;
