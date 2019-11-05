import React from 'react';
import styled from 'styled-components';
import { DataProviders } from '@burner-wallet/ui-core';
import { Asset, AccountBalanceData, PluginElementContext } from '@burner-wallet/types';
import BalanceItem from './BalanceItem';
const { AccountBalance } = DataProviders;

const Row = styled.section`
  padding: 32px 16px;
  margin: 0 -16px;
  overflow-x: scroll;
  white-space: nowrap;
`;

const BalanceRow: React.FC<PluginElementContext> = ({ defaultAccount, assets }) => (
  <Row>
    {assets.map((asset: Asset) => (
      <AccountBalance
        key={asset.id}
        asset={asset.id}
        account={defaultAccount}
        render={(data: AccountBalanceData | null) => (
          <BalanceItem
            asset={asset}
            usdBalance={data && data.usdBalance}
            balance={data && data.displayBalance}
          />
        )}
      />
    ))}
  </Row>
);

export default BalanceRow;
