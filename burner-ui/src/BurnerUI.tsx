import React, { Component } from 'react';
import BurnerProvider from './BurnerProvider';
import Providers from './Providers';
import Pages from './Pages';
import Template from './Template';
import Header from './components/Header';
import Scanner from './components/Scanner';
import './BurnerUI.css';

interface BurnerUIProps {
  core: any,
  assets: any[],
}

export default class BurnerUI extends Component<BurnerUIProps, any> {
  render() {
    return (
      <BurnerProvider core={this.props.core} assets={this.props.assets}>
        <Providers>
          <Template>
            <Scanner />
            <Header />
            <Pages />
          </Template>
        </Providers>
      </BurnerProvider>
    );
  }
}
