import React, { ComponentType } from 'react';
import { Switch, Route, Redirect, RouteComponentProps } from 'react-router-dom';
import { withBurner } from '../BurnerProvider';
import { BurnerPluginData } from '../Plugins';
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
    {pluginData.pages.map(({ path, Component, plugin }) => (
      <Route path={path} key={path} render={(props) => {
        const WrappedComponent = withBurner(Component);
        return <WrappedComponent plugin={plugin} {...props} />
      }} />
    ))}
    <Redirect to="/" />
  </Switch>
);

export default Pages;
