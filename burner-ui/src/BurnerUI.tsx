import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Asset } from '@burner-wallet/assets';
import BurnerCore from '@burner-wallet/core';
import burnerComponents from './components/burnerComponents';
import Header from './components/Header';
import Scanner from './components/Scanner';
import BurnerProvider from './BurnerProvider';
import Pages from './Pages';
import Template from './Template';
import HistoryProvider from './HistoryProvider';
import Plugins from './Plugins';
import { Plugin } from './';

interface BurnerUIProps {
  core: BurnerCore,
  plugins?: any[],
  title?: string,
  theme?: any,
}

export default class BurnerUI extends Component<BurnerUIProps, any> {
  private plugins: Plugins;

  static defaultProps = {
    plugins: [],
  }

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

  getAssets(): Asset[] {
    return this.props.core.getAssets();
  }

  render() {
    return (
      <Router>
        <BurnerProvider
          core={this.props.core}
          pluginData={this.state.pluginData}
          burnerComponents={burnerComponents}
        >
          <HistoryProvider core={this.props.core}>
            <Template theme={this.props.theme}>
              <Scanner />
              <Header title={this.props.title} />
              <Pages pluginData={this.state.pluginData} />
            </Template>
          </HistoryProvider>
        </BurnerProvider>
      </Router>
    );
  }
}
