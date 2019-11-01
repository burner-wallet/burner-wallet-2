import React from 'react';
import { Asset } from '@burner-wallet/types';
import styled from 'styled-components';

const Container = styled.div`
  display: inline-flex;
  margin: 8px;
  padding: 8px 16px 8px 8px;
  border: 1px solid #ccc;
  border-radius: 8px;
`;

const AssetName = styled.div``;

const Value = styled.div`
  margin-left: 8px;
  font-weight: 700;
`;

interface BalanceProps {
  asset: Asset;
  balance: string;
}

const Balance: React.FC<BalanceProps> = ({ asset, balance }) => (
  <Container>
    {/* logo */}
    <AssetName>{asset.name}</AssetName>
    <Value>{asset.getDisplayValue(balance)}</Value>
  </Container>
);

export default Balance;
