import React, { ComponentType } from 'react';
import { Switch, Route, RouteComponentProps } from 'react-router-dom';
import { withBurner, BurnerContext } from '../BurnerProvider';
import { BurnerPluginData } from '../BurnerUI';
import AdvancedPage from './AdvancedPage';
import HomePage from './HomePage';
import ReceiptPage from './ReceiptPage';
import ReceivePage from './ReceivePage';
import SendPage from './SendPage';

interface PageProps {
  pluginData: BurnerPluginData,
}

const Pages: React.FC<PageProps> = ({ pluginData }) => (
  <Switch>
    <Route path="/" exact component={withBurner(HomePage)} />
    <Route path="/receive" component={withBurner(ReceivePage)} />
    <Route path="/send" component={withBurner(SendPage)} />
    <Route path="/receipt/:asset/:txHash" component={withBurner(ReceiptPage)} />
    <Route path="/advanced" component={withBurner(AdvancedPage)} />
    {pluginData.pages.map(({ path, Component }) => (
      <Route path={path} component={withBurner(Component as ComponentType<BurnerContext>)} key={path} />
    ))}
  </Switch>
);

export default Pages;
