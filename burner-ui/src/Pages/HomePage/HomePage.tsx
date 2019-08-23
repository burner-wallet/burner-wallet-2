import React from 'react';
import { Link } from 'react-router-dom';
import injectSheet from 'react-jss';
import Color from 'color';

import { BurnerContext, withBurner } from '../../BurnerProvider';
import Button from '../../components/Button';
import Page from '../../components/Page';
import PluginElements from '../../components/PluginElements';
import AccountBalance, { AccountBalanceData } from '../../data-providers/AccountBalance';
import History from '../../data-providers/History';
import BalanceRow from './BalanceRow';
import HistoryEvent from './HistoryEvent';

const styles = (theme: any) => ({
  balances: {
    padding: 0,
  },
  buttons: {
    display: 'flex',
    padding: 0,
    flexWrap: 'wrap',
  },
  buttonContainer: {
    display: 'block',
    width: '50%',
    padding: 4,
    boxSizing: 'border-box',
    flex: '0 0 50%',
  },
  homeButton: {
    backgroundColor: theme.homeButtonColor,
  },
  scanBtn: {
    position: 'fixed',
    bottom: 20,
    right: 20,
    height: 60,
    width: 60,
    borderRadius: 100,
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' style='width:24px;height:24px' viewBox='0 0 24 24'%3E%3Cpath fill='%23000000' d='M4,4H10V10H4V4M20,4V10H14V4H20M14,15H16V13H14V11H16V13H18V11H20V13H18V15H20V18H18V20H16V18H13V20H11V16H14V15M16,15V18H18V15H16M4,20V14H10V20H4M6,6V8H8V6H6M16,6V8H18V6H16M6,16V18H8V16H6M4,11H6V13H4V11M9,11H13V15H11V13H9V11M11,6H13V10H11V6M2,2V6H0V2A2,2 0 0,1 2,0H6V2H2M22,0A2,2 0 0,1 24,2V6H22V2H18V0H22M2,18V22H6V24H2A2,2 0 0,1 0,22V18H2M22,22V18H24V22A2,2 0 0,1 22,24H18V22H22Z' /%3E%3C/svg%3E")`,
    backgroundSize: '60%',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundColor: Color(theme.accentColor).lighten(0.2).hsl().string(),
  },
  advancedLink: {
    color: Color(theme.paperBackground).isLight() ? '#333333' : '#cccccc',
  },
});

interface HomeButtonProps {
  path: string,
  title: string,
  classes: any,
}

const HomeButton: React.FC<HomeButtonProps> = ({ path, title, classes }) => (
  <li className={classes.buttonContainer}>
    <Button to={path} className={classes.homeButton}>{title}</Button>
  </li>
)

const ADDRESS_REGEX = /^(?:0x)?[0-9a-f]{40}$/i;
const PK_REGEX = /^(?:0x)?[0-9a-f]{64}$/i;

const HomePage: React.FC<BurnerContext & { classes: any }> = ({ accounts, actions, assets, pluginData, classes }) => (
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
      <HomeButton path="/receive" title="Receive" classes={classes} />
      <HomeButton path="/send" title="Send" classes={classes} />
      {pluginData.homeButtons.map(({ title, path }) => (
        <HomeButton title={title} path={path} key={title} classes={classes} />
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

    <Link to="/advanced" className={classes.advancedLink}>Advanced</Link>
  </Page>
);

export default injectSheet(styles)(withBurner(HomePage));
