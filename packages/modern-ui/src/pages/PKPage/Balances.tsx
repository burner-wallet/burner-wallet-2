import React from 'react';
import { Asset } from '@burner-wallet/types';
import Balance from './Balance';

interface BalancesProps {
  assets: Asset[];
  balances: string[];
}

interface Balance {
  asset: Asset;
  balance: string;
}

const Balances: React.FC<BalancesProps> = ({ assets, balances }) => {
  const nonEmptyBalances: Balance[] = assets
    .map((asset: Asset, i: number) => ({ asset, balance: balances[i] }))
    .filter(({ balance }) => balance !== '0');

  return (
    <div>
      {nonEmptyBalances.map(({ asset, balance }) => (
        <Balance asset={asset} balance={balance} key={asset.id} />
      ))}
    </div>
  );
};

export default Balances;
