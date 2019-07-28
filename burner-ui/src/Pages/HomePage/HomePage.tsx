import React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { BurnerContext, withBurner } from '../../BurnerProvider';
import Page from '../../components/Page';
import PluginElements from '../../components/PluginElements';
import AccountBalance, { AccountBalanceData } from '../../data-providers/AccountBalance';
import BalanceRow from './BalanceRow';
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

const ADDRESS_REGEX = /^(?:0x)?[0-9a-f]{40}$/i;
const PK_REGEX = /^(?:0x)?[0-9a-f]{64}$/i;

const HomePage: React.FC<BurnerContext & RouteComponentProps> = ({ accounts, actions, assets, pluginData, history }) => (
  <Page>
    <button className={classes.scanBtn} onClick={async () => {
      try {
        const result = await actions.scanQrCode();
        if (ADDRESS_REGEX.test(result)) {
          history.push('/send', { address: result });
        } else if (PK_REGEX.test(result)) {
          actions.callSigner('writeKey', accounts[0], result);
        } else if (result.indexOf(location.origin) === 0) {
          history.push(result.substr(location.origin.length));
        }
      } catch (e) {}
    }} />

    <PluginElements position="home-top" />

    {accounts.length > 0 ? (
      <ul className={classes.balances}>
        {assets.map(asset =>
          <AccountBalance
            key={asset.id}
            asset={asset.id}
            account={accounts[0]}
            render={(err: Error, data: AccountBalanceData | null) => (
              <BalanceRow
                asset={asset}
                usdBalance={data && data.usdBalance}
                balance={data && data.balance}
              />
            )}
          />
        )}
      </ul>
    )  : 'Loading'}

    <PluginElements position="home-middle" />

    <ul className={classes.buttons}>
      <HomeButton path="/receive" title="Receive" />
      <HomeButton path="/send" title="Send" />
      {pluginData.homeButtons.map(({ title, path }) => (
        <HomeButton title={title} path={path} key={title} />
      ))}
    </ul>

    <PluginElements position="home-bottom" />

    <Link to="/advanced">Advanced</Link>
  </Page>
);

export default withBurner(HomePage);
