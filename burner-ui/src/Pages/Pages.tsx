import React, { ComponentType } from 'react';
import { Switch, Route } from 'react-router-dom';
import { withBurner } from '../BurnerProvider';
import HomePage from './HomePage';
import ReceiptPage from './ReceiptPage';
import ReceivePage from './ReceivePage';
import SendPage from './SendPage';

interface BurnerRouteProps {
  path: string,
  page: ComponentType,
  exact: bool,
}

const BurnerRoute = ({ path, page, exact }: BurnerRouteProps) => (
  <Route
    path={path}
    exact={exact}
    render={(props) => {
      const Page = withBurner(page);
      return <Page {...props}/>
    }}
  />
)

const App: React.FC = () => (
  <Switch>
    <BurnerRoute path="/" exact page={HomePage as ComponentType} />
    <BurnerRoute path="/receive" page={ReceivePage as ComponentType} />
    <BurnerRoute path="/send" page={SendPage as ComponentType} />
    <BurnerRoute path="/receipt/:asset/:txHash" page={ReceiptPage as ComponentType} />
  </Switch>
);

export default App;
