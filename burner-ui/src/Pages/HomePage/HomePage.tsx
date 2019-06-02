import React from 'react';
import { Link } from 'react-router-dom';
import { BurnerContext } from '../../BurnerProvider';
import Page from '../../components/Page';
import Balances from './Balances';

const HomePage = ({ accounts, assets }: BurnerContext) => (
  <Page>
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
  </Page>
);

export default HomePage;
