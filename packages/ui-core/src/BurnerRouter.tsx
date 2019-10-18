import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { BurnerPluginData } from './Plugins';
import { Page } from './';

interface BurnerRouterProps {
  pages: Page[],
  pluginData: BurnerPluginData,
}

const BurnerRouter: React.FC<BurnerRouterProps> = ({ pages, pluginData }) => (
  <Switch>
    {pages.map(({ path, component }) => (
      <Route path={path} component={component} key={path} exact={path === '/'} />
    ))}
    {pluginData.pages.map(({ path, Component, plugin }) => (
      <Route path={path} key={path} render={(props) => (
        <Component plugin={plugin} {...props} />
      )} />
    ))}
    <Redirect to="/" />
  </Switch>
);

export default BurnerRouter;
