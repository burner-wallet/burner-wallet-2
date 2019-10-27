import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Asset } from '@burner-wallet/assets';
import BurnerCore from '@burner-wallet/core';

import dataProviders from './data-providers';
import BurnerProvider from './BurnerProvider';
import BurnerRouter from './BurnerRouter';
import Plugins, { BurnerPluginData } from './Plugins';
import { Plugin, BurnerUIComponents, BurnerComponents, Page } from '@burner-wallet/types';

interface BurnerUIProps {
  core: BurnerCore;
  plugins?: any[];
  title?: string;
  theme?: any;
}

interface BurnerUIState {
  pluginData: BurnerPluginData;
}

// TODO: validate pages against this
const REQUIRED_PAGES = ['/', '/confirm', '/pk'];

export default abstract class BurnerUICore extends Component<BurnerUIProps, BurnerUIState> {
  private plugins: Plugins;
  private _burnerComponents: BurnerComponents;

  static defaultProps = {
    plugins: [],
  }

  constructor(props: BurnerUIProps) {
    super(props);

    const internalPlugins = this.getInternalPlugins();
    const _plugins = props.plugins ? [...internalPlugins, ...props.plugins] : internalPlugins;
    this.plugins = new Plugins(_plugins as Plugin[], this);

    this.state = {
      pluginData: this.plugins.getData(),
    };

    this._burnerComponents = {
      ...dataProviders,
      ...this.burnerComponents(),
    };
  }

  abstract content(): React.ReactNode;
  abstract getPages(): Page[];
  abstract burnerComponents(): BurnerUIComponents;

  getInternalPlugins(): Plugin[] {
    return [];
  }

  componentDidMount() {
    this.plugins.onDataChange(pluginData => this.setState({ pluginData }));
  }

  getCore() {
    return this.props.core;
  }

  getAssets(): Asset[] {
    return this.props.core.getAssets();
  }

  router() {
    return (
      <BurnerRouter pluginData={this.state.pluginData} pages={this.getPages()} />
    );
  }

  render() {
    return (
      <Router>
        <BurnerProvider
          core={this.props.core}
          pluginData={this.state.pluginData}
          burnerComponents={this._burnerComponents}
        >
          {this.content()}
        </BurnerProvider>
      </Router>
    );
  }
}
