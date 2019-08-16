import React from 'react';
import { Link } from 'react-router-dom';
import { BurnerContext, withBurner } from '../../BurnerProvider';
import Button from '../../components/Button';
import Page from '../../components/Page';
import PluginElements from '../../components/PluginElements';
import AccountBalance, { AccountBalanceData } from '../../data-providers/AccountBalance';
import History from '../../data-providers/History';
import BalanceRow from './BalanceRow';
import HistoryEvent from './HistoryEvent';
const classes = require('./HomePage.module.css');

interface HomeButtonProps {
  path: string,
  title: string,
}

const HomeButton: React.FC<HomeButtonProps> = ({ path, title }) => (
  <li className={classes.buttonContainer}>
    <Button to={path}>{title}</Button>
  </li>
)

const ADDRESS_REGEX = /^(?:0x)?[0-9a-f]{40}$/i;
const PK_REGEX = /^(?:0x)?[0-9a-f]{64}$/i;

const HomePage: React.FC<BurnerContext> = ({ accounts, actions, assets, pluginData }) => (
  <Page>
    <button className={classes.scanBtn} onClick={async () => {
      try {
        const result = await actions.scanQrCode();
        if (ADDRESS_REGEX.test(result)) {
          actions.navigateTo('/send', { address: result });
        } else if (PK_REGEX.test(result)) {
          actions.callSigner('writeKey', accounts[0], result);
        } else if (result.indexOf(location.origin) === 0) {
          actions.navigateTo(result.substr(location.origin.length));
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
                balance={data && data.displayBalance}
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

    {accounts.length > 0 && (
      <History
        account={accounts[0]}
        render={(events: any[]) => events.map(event => (
          <HistoryEvent key={JSON.stringify(event)} event={event} account={accounts[0]} />
        ))}
      />
    )}

    <PluginElements position="home-bottom" />

    <Link to="/advanced">Advanced</Link>
  </Page>
);

export default withBurner(HomePage);
