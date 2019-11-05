import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';
import { BurnerContext, withBurner, DataProviders } from '@burner-wallet/ui-core';
import { Asset, SendData } from '@burner-wallet/types';
import Button from '../../components/Button';
import Page from '../../components/Page';
import LineItem from '../../components/LineItem';
const { TransactionDetails } = DataProviders;

const AddressSegment = styled.span<{ hidden?: boolean }>`
  display: inline-block;
  overflow: hidden;
  font-family: monospace;

  ${props => props.hidden && `
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: 100px;
  `}
`

const Address: React.FC<{address: string}> = ({ address }) => (
  <span>
    <AddressSegment hidden>{address.substr(0, 34)}</AddressSegment>
    <AddressSegment>{address.substr(-8)}</AddressSegment>
  </span>
);

interface MatchParams {
  asset: string;
  txHash: string;
  account: string;
}


const BigEmoji = styled.div`
  font-size: 106px;
`;

const formatDate = (timestamp: number) => (new Date(timestamp * 1000)).toLocaleString();

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
        // @ts-ignore
        const date = formatDate(tx.timestamp)

        return (
          <section>
            <div>
              <LineItem name="From" value={<Address address={tx.from!} />}/>
              <LineItem name="To" value={<Address address={tx.to!} />}/>
              <LineItem name="Date" value={date}/>
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
