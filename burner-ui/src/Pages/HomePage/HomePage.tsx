import React from 'react';
import { Link } from 'react-router-dom';
import { BurnerContext } from '../../BurnerProvider';
import Page from '../../components/Page';
import AccountBalance from '../../data-providers/AccountBalance';
import classes from './HomePage.module.css';

const HomePage = ({ accounts, assets }: BurnerContext) => (
  <Page>
    {accounts.length > 0 ? (
      <ul className={classes.balances}>
        {assets.map(asset =>
          <AccountBalance
            key={asset.id}
            asset={asset.id}
            account={accounts[0]}
            render={(err, data) => (
              <li className={classes.balanceRow}>
                <div className={classes.assetName}>{asset.name}</div>
                <div className={classes.assetBalance}>
                  {err || !data ? '-' : `$${data.usdBalance}`}
                </div>
              </li>
            )}
          />
        )}
      </ul>
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
