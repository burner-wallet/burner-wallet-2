import React from 'react';
import Balances from './Balances';
import { BurnerContext } from '../../BurnerProvider';

const HomePage = ({ accounts, assets }: BurnerContext) => (
  <div>
    {accounts.length > 0 ? (
      <Balances
        account={accounts[0]}
        assets={assets}
      />
    )  : 'Loading'}
  </div>
);

export default HomePage;
