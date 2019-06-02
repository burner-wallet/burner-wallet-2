import React from 'react';
import { Link } from 'react-router-dom';
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
    <ul>
      <li>
        <Link to="/receive">Receive</Link>
      </li>
      <li>
        <Link to="/send">Send</Link>
      </li>
    </ul>
  </div>
);

export default HomePage;
