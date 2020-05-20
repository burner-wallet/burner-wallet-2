import React from 'react';
import BurnerUICore, { Page } from '@burner-wallet/ui-core';

import burnerComponents from './components/burner-components';
import Header from './components/Header';
import Loading from './components/Loading';
import Scanner from './components/Scanner';
import Template from './Template';
import options from './options';

import internalPlugins from './internal-plugins';
import ActivityPage from './pages/ActivityPage';
import AdvancedPage from './pages/AdvancedPage';
import ConfirmPage from './pages/ConfirmPage';
import HomePage from './pages/HomePage';
import PKPage from './pages/PKPage';
import ReceiptPage from './pages/ReceiptPage';
import ReceivePage from './pages/ReceivePage';
import SendPage from './pages/SendPage';


export default class ModernUI extends BurnerUICore {
  constructor(props: any) {
    super(props);

    if (props.theme && props.theme.balanceStyle) {
      options.balanceStyle = props.theme.balanceStyle;
    }
  }

  getPages(): Page[] {
    return [
      { path: '/', component: HomePage },
      { path: '/activity', component: ActivityPage },
      { path: '/pk', component: PKPage },
      { path: '/receive', component: ReceivePage },
      { path: '/send', component: SendPage },
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
        <Loading />
        <Header title={this.props.title} />
        {this.router()}
      </Template>
    );
  }
}
