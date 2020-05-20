import React from 'react';
import styled from 'styled-components';
import { DataProviders } from '@burner-wallet/ui-core';
import { Asset, AccountBalanceData, PluginElementContext } from '@burner-wallet/types';
import options from '../../options';
import BalanceItem from './BalanceItem';
const { AccountBalance } = DataProviders;

const Row = styled.section`
  padding: 16px 0;
  margin: 0 -16px;
  overflow-x: scroll;
  display: flex;
`;

const Scroll = styled.div`
  padding: 0 16px;
  display: flex;

  ${() => options.balanceStyle === 'stack' && `
    flex-direction: column;
    flex: 1;
  `}
`;

const BalanceRow: React.FC<PluginElementContext> = ({ defaultAccount, assets }) => (
  <Row>
    <Scroll>
      {assets.map((asset: Asset) => (
        <AccountBalance
          key={asset.id}
          asset={asset.id}
          account={defaultAccount}
          render={(data: AccountBalanceData | null) => (
            <BalanceItem
              asset={asset}
              balance={data && data.balance}
              growthRate={(data && data.growthRate) || '0'}
            />
          )}
        />
      ))}
    </Scroll>
  </Row>
);

export default BalanceRow;
