import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';
import { BurnerContext, withBurner, DataProviders } from '@burner-wallet/ui-core';
import { SendData } from '@burner-wallet/types';
import { Asset } from '@burner-wallet/assets';
import Button from '../../components/Button';
import Page from '../../components/Page';
import LineItem from '../../components/LineItem';
const { TransactionDetails } = DataProviders;

interface MatchParams {
  asset: string;
  txHash: string;
  account: string;
}


const BigEmoji = styled.div`
  font-size: 106px;
`;

const ReceiptPage: React.FC<RouteComponentProps<MatchParams> & BurnerContext> = ({ match, defaultAccount, assets }) => (
  <Page title="Transaction Receipt">
    <TransactionDetails
      asset={match.params.asset}
      txHash={match.params.txHash}
      render={(tx: SendData) => {
        if (!tx) {
          return (
            <section>
              <BigEmoji>&#128269;</BigEmoji>
              <div>Transaction not found...</div>
              <div>The transaction may still be propogating</div>
            </section>
          );
        }
        const [asset] = assets.filter((_asset: Asset) => _asset.id === tx.asset);
        const amtValue = asset
          ? `${asset.getDisplayValue(tx.value!)} ${asset.name}`
          // @ts-ignore
          : `${tx.displayValue} (unknown asset)`;

        return (
          <section>
            <div>
              <LineItem name="From" value={`${tx.from!.substr(0, 8)}...${tx.from!.substr(-8)}`}/>
              <LineItem name="To" value={`${tx.to!.substr(0, 8)}...${tx.to!.substr(-8)}`}/>
              <LineItem name="Date" value="TODO"/>
            </div>

            <div>
              <h2>{defaultAccount === tx.from ? 'Sent' : 'Received'}</h2>
              <div>{amtValue}</div>
            </div>

            {tx.message && (
              <div>
                <h2>Message</h2>
                <div>{tx.message}</div>
              </div>
            )}
          </section>
        );
      }}
    />
    <Button to="/">Back</Button>
  </Page>
);

export default withBurner(ReceiptPage);
