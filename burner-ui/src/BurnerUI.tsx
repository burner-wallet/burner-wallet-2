import React, { Component } from 'react';
import { Asset } from '@burner-wallet/assets';
import BurnerProvider, { BurnerContext } from './BurnerProvider';
export { BurnerContext } from './BurnerProvider';
import Providers from './Providers';
import Pages from './Pages';
import Template from './Template';
import Header from './components/Header';
import Scanner from './components/Scanner';
import Plugins from './Plugins';
export { Plugin, BurnerPluginContext } from './Plugins';
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
    this.plugins = new Plugins(props.plugins, this);

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
      <BurnerProvider core={this.props.core} assets={this.props.assets} pluginData={this.state.pluginData}>
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
