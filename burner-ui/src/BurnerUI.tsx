import React, { Component } from 'react';
import { Asset } from '@burner-wallet/assets';
import BurnerProvider, { BurnerContext } from './BurnerProvider';
import Providers from './Providers';
import Pages from './Pages';
import Template from './Template';
import Header from './components/Header';
import Scanner from './components/Scanner';
import './BurnerUI.css';

interface BurnerUIProps {
  core: any,
  assets: Asset[],
  plugins: any[],
}

interface PluginPage {
  path: string,
  Component: React.ComponentType,
}

interface PluginHomeButton {
  title: string,
  path: string,
}

export interface BurnerPluginData {
  pages: PluginPage[],
  homeButtons: PluginHomeButton[],
}

export interface BurnerPluginContext {
  addPage: (path: string, Component: React.ComponentType<BurnerContext>) => any,
  addHomeButton: (title: string, path: string) => any,
  getAssets: () => Asset[],
  getWeb3: (network: string) => any,
}

export type BurnerContext = BurnerContext;

export default class BurnerUI extends Component<BurnerUIProps, any> {
  private pluginContext: BurnerPluginContext;

  constructor(props: BurnerUIProps) {
    super(props);
    this.state = {
      pluginData: {
        pages: [],
        homeButtons: [],
      },
    };

    // TODO: These methods must be called asyncronously, the chagnes should be queued so that isn't necessary
    this.pluginContext = {
      addPage: this.addPluginPage.bind(this),
      addHomeButton: this.addPluginHomeButton.bind(this),
      getAssets: () => props.assets,
      getWeb3: (network: string) => props.core.getWeb3(network),
    };
  }

  componentDidMount() {
    this.props.plugins.forEach(plugin => plugin.initializePlugin(this.pluginContext));
  }

  addPluginPage(path: string, Component: React.ComponentType<BurnerContext>) {
    return this.setState({
      pluginData: {
        ...this.state.pluginData,
        pages: [...this.state.pluginData.pages, { path, Component }],
      }
    });
  }

  addPluginHomeButton(title: string, path: string) {
    return this.setState({
      pluginData: {
        ...this.state.pluginData,
        homeButtons: [...this.state.pluginData.homeButtons, { title, path }],
      }
    });
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
