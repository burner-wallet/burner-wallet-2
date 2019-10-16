import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { BurnerPluginData } from '../Plugins';
import AdvancedPage from './AdvancedPage';
import ConfirmPage from './ConfirmPage';
import HomePage from './HomePage';
import NewPKPage from './NewPKPage';
import ReceiptPage from './ReceiptPage';
import ReceivePage from './ReceivePage';
import SendPage from './SendPage';

interface PageProps {
  pluginData: BurnerPluginData,
}

const Pages: React.FC<PageProps> = ({ pluginData }) => (
  <Switch>
    <Route path="/" exact component={HomePage} />
    <Route path="/pk" component={NewPKPage} />
    <Route path="/receive" component={ReceivePage} />
    <Route path="/send" component={SendPage} />
    <Route path="/confirm" component={ConfirmPage} />
    <Route path="/receipt/:asset/:txHash" component={ReceiptPage} />
    <Route path="/advanced" component={AdvancedPage} />
    {pluginData.pages.map(({ path, Component, plugin }) => (
      <Route path={path} key={path} render={(props) => (
        <Component plugin={plugin} {...props} />
      )} />
    ))}
    <Redirect to="/" />
  </Switch>
);

export default Pages;
