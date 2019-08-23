import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import QRCode from 'qrcode.react';
import Page from '../../components/Page';
import LineItem from '../../components/LineItem';
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
            <LineItem name="From" value={tx.from} classes={classes} />
            <LineItem name="To" value={tx.to} classes={classes} />
            <LineItem name="Amount" value={`${tx.displayValue} ${tx.assetName}`} classes={classes} />
            {tx.message && <LineItem name="Message" value={tx.message} classes={classes} />}
          </div>
        )
      }}
    />
  </Page>
);

export default ReceiptPage;
