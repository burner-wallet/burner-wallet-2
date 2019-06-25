import React, { Component } from 'react';
import { Asset } from '@burner-wallet/assets';
import BurnerProvider from './BurnerProvider';
import * as burnerComponents from './components/burnerComponents';
import Providers from './Providers';
import Pages from './Pages';
import Template from './Template';
import Header from './components/Header';
import Scanner from './components/Scanner';
import Plugins from './Plugins';
import { Plugin } from './types';
import './BurnerUI.css';

interface BurnerUIProps {
  core: any,
  assets: Asset[],
  plugins: any[],
}

export default class BurnerUI extends Component<BurnerUIProps, any> {
  private plugins: Plugins;

  constructor(props: BurnerUIProps) {
    super(props);
    this.plugins = new Plugins(props.plugins as Plugin[], this);

    this.state = {
      pluginData: this.plugins.getData(),
    };
  }

  componentDidMount() {
    this.plugins.onDataChange(pluginData => this.setState({ pluginData }));
  }

  getCore() {
    return this.props.core;
  }

  getAssets() {
    return this.props.assets;
  }

  render() {
    return (
      <BurnerProvider
        core={this.props.core}
        assets={this.props.assets}
        pluginData={this.state.pluginData}
        burnerComponents={burnerComponents}
      >
        <Providers>
          <Template>
            <Scanner />
            <Header />
            <Pages pluginData={this.state.pluginData} />
          </Template>
        </Providers>
      </BurnerProvider>
    );
  }
}
