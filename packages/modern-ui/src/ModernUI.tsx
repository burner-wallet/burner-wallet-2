import React from 'react';
import BurnerUICore, { Page } from '@burner-wallet/ui-core';

import burnerComponents from './components/burner-components';
import Header from './components/Header';
// import Loading from './components/Loading';
import Scanner from './components/Scanner';
import Template from './Template';

import internalPlugins from './internal-plugins';
import ActivityPage from './pages/ActivityPage';
import AdvancedPage from './pages/AdvancedPage';
import ConfirmPage from './pages/ConfirmPage';
import PKPage from './pages/PKPage';
import ReceiptPage from './pages/ReceiptPage';
import SwipableHomePage from './pages/SwipableHomePage';


export default class ClassicUI extends BurnerUICore {
  getPages(): Page[] {
    return [
      { path: '/', component: SwipableHomePage },
      { path: '/activity', component: ActivityPage },
      { path: '/pk', component: PKPage },
      { path: '/receive', component: SwipableHomePage },
      { path: '/send', component: SwipableHomePage },
      { path: '/confirm', component: ConfirmPage },
      { path: '/receipt/:asset/:txHash', component: ReceiptPage },
      { path: '/advanced', component: AdvancedPage },
    ];
  }

  getInternalPlugins() {
    return internalPlugins;
  }

  burnerComponents() {
    return burnerComponents;
  }

  content() {
    return (
      <Template theme={this.props.theme}>
        <Scanner />
        {/*<Loading />*/}
        <Header title={this.props.title} />
        {this.router()}
      </Template>
    );
  }
}
