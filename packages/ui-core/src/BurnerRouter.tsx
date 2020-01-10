import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Page, BurnerPluginData } from '@burner-wallet/types';

interface BurnerRouterProps {
  pages: Page[];
  pluginData: BurnerPluginData;
}

const BurnerRouter: React.FC<BurnerRouterProps> = ({ pages, pluginData }) => (
  <Switch>
    {pages.map(({ path, component }) => (
      <Route path={path} component={component} key={path} exact={path === '/'} />
    ))}
    {pluginData.pages.map(({ path, Component }) => (
      <Route path={path} key={path} component={Component} />
    ))}
    <Redirect to="/" />
  </Switch>
);

export default BurnerRouter;
