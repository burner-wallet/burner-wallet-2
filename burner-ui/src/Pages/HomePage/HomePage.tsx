import React from 'react';
import { Link } from 'react-router-dom';
import { BurnerContext } from '../../BurnerProvider';
import Page from '../../components/Page';
import AccountBalance, { AccountBalanceData } from '../../data-providers/AccountBalance';
const classes = require('./HomePage.module.css');

interface HomeButtonProps {
  path: string,
  title: string,
}

const HomeButton: React.FC<HomeButtonProps> = ({ path, title }) => (
  <li className={classes.buttonContainer}>
    <Link to={path} className={classes.button}>{title}</Link>
  </li>
)

const HomePage: React.FC<BurnerContext> = ({ accounts, assets, pluginData }) => (
  <Page>
    {accounts.length > 0 ? (
      <ul className={classes.balances}>
        {assets.map(asset =>
          <AccountBalance
            key={asset.id}
            asset={asset.id}
            account={accounts[0]}
            render={(err: Error, data: AccountBalanceData | null) => (
              <li className={classes.balanceRow}>
                <div className={classes.assetName}>{asset.name}</div>
                <div className={classes.assetBalance}>
                  {(err || !data) && '-'}
                  {data && (data.usdBalance ? `$${data.usdBalance}` : data.displayBalance)}
                </div>
              </li>
            )}
          />
        )}
      </ul>
    )  : 'Loading'}

    <ul className={classes.buttons}>
      <HomeButton path="/receive" title="Receive" />
      <HomeButton path="/send" title="Send" />
      {pluginData.homeButtons.map(({ title, path }) => (
        <HomeButton title={title} path={path} key={title} />
      ))}
    </ul>

    <Link to="/advanced">Advanced</Link>
  </Page>
);

export default HomePage;
