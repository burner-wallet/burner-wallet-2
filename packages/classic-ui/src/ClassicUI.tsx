import React from 'react';
import BurnerUICore, { Page } from '@burner-wallet/ui-core';

import burnerComponents from './components';
import Header from './components/Header';
import Loading from './components/Loading';
import Scanner from './components/Scanner';
import Template from './Template';

import AdvancedPage from './Pages/AdvancedPage';
import ConfirmPage from './Pages/ConfirmPage';
import HomePage from './Pages/HomePage';
import NewPKPage from './Pages/NewPKPage';
import ReceiptPage from './Pages/ReceiptPage';
import ReceivePage from './Pages/ReceivePage';
import SendPage from './Pages/SendPage';


export default class ClassicUI extends BurnerUICore {
  getPages(): Page[] {
    return [
      { path: '/', component: HomePage },
      { path: '/pk', component: NewPKPage },
      { path: '/receive', component: ReceivePage },
      { path: '/send', component: SendPage },
      { path: '/confirm', component: ConfirmPage },
      { path: '/receipt/:asset/:txHash', component: ReceiptPage },
      { path: '/advanced', component: AdvancedPage },
    ];
  }

  burnerComponents() {
    return burnerComponents;
  }

  content() {
    return (
      <Template theme={this.props.theme}>
        <Loading />
        <Scanner />
        <Header title={this.props.title} />
        {this.router()}
      </Template>
    );
  }
}
