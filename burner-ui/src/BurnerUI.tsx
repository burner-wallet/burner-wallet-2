import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Asset } from '@burner-wallet/assets';
import BurnerProvider from './BurnerProvider';
import burnerComponents from './components/burnerComponents';
import Providers from './Providers';
import Pages from './Pages';
import Template from './Template';
import Header from './components/Header';
import Scanner from './components/Scanner';
import Plugins from './Plugins';
import { Plugin } from './';
import './BurnerUI.css';

interface BurnerUIProps {
  core: any,
  plugins: any[],
  title?: string,
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
          <Template>
            <Scanner />
            <Header title={this.props.title} />
            <Pages pluginData={this.state.pluginData} />
          </Template>
        </BurnerProvider>
      </Router>
    );
  }
}
