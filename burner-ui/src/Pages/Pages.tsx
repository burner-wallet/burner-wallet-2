import React, { ComponentType } from 'react';
import { Switch, Route } from 'react-router-dom';
import HomePage from './HomePage';
import { withBurner } from '../BurnerProvider';

interface BurnerRouteProps {
  path: string,
  page: ComponentType,
}

const BurnerRoute = ({ path, page }: BurnerRouteProps) => (
  <Route
    path={path}
    render={() => {
      const Page = withBurner(page);
      return <Page />
    }}
  />
)

const App: React.FC = () => (
  <Switch>
    <BurnerRoute path="/" page={HomePage as ComponentType} />
  </Switch>
);

export default App;
