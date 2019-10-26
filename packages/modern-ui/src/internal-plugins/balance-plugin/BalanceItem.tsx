import React from 'react';
import { Asset } from '@burner-wallet/assets';
import { Card } from 'rimble-ui';
import styled from 'styled-components';

interface BalanceItemProps {
  asset: Asset;
  usdBalance?: string | null;
  balance?: string | null;
}

const BalanceCard = styled(Card)`
  display: inline-flex;
  justifyContent: space-between;
  font-size: 48px;
  font-weight: 400;
  text-align: right;
  padding: 8px 16px 8px 8px;
  border: 1px solid #ccc;
  border-radius: 8px;
  width: 225px;

  &:not(:first-of-type) {
    margin-left: 12px;
  }
`;

const BalanceText = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  text-align: right;
`;

const Value = styled.div`
  font-size: 48px;
`;

const AssetName = styled.div`
  font-size: 16px;
`;

const BalanceItem: React.FC<BalanceItemProps> = ({ asset, usdBalance, balance }) => {
  let value = '-';
  if (usdBalance) {
    value = `$${parseFloat(usdBalance).toFixed(2)}`;
  } else if (balance) {
    value = parseFloat(balance).toFixed(2);
  }

  return (
    <BalanceCard>
      {/* icon */}
      <BalanceText>
        <Value>{value}</Value>
        <AssetName>{asset.name}</AssetName>
      </BalanceText>
    </BalanceCard>
  );
}

export default BalanceItem;
