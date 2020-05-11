import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Page, BurnerPluginData } from '@burner-wallet/types';

interface BurnerRouterProps {
  pages: Page[];
  pluginData: BurnerPluginData;
}

const BurnerRouter: React.FC<BurnerRouterProps> = ({ pages, pluginData }) => (
  <Switch>
    {pages.map(({ path, component, exact }) => (
      <Route
        path={path}
        component={component}
        key={JSON.stringify(path)}
        exact={exact || path === '/'}
      />
    ))}
    {pluginData.pages.map(({ path, Component }) => (
      <Route path={path} key={JSON.stringify(path)} component={Component} />
    ))}
    <Redirect to="/" />
  </Switch>
);

export default BurnerRouter;
