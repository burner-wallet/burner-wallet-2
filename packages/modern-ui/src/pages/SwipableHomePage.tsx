import React from 'react';
import SwipeableRoutes from 'react-swipeable-routes';
import { Route } from 'react-router-dom';
import ReceivePage from './ReceivePage';
import HomePage from './HomePage';
import SendPage from './SendPage';

const SwipableHomePage: React.FC = () => {
  return (
    <SwipeableRoutes>
      <Route path="/receive" component={ReceivePage} />
      <Route path="/" exact component={HomePage} />
      <Route path="/send" component={SendPage} />
    </SwipeableRoutes>
  );
};

export default SwipableHomePage;
