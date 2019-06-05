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
  plugins: any[],
}

export default class BurnerUI extends Component<BurnerUIProps, any> {
  constructor(props) {
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
    };
  }

  componentDidMount() {
    this.props.plugins.forEach(plugin => plugin.initializePlugin(this.pluginContext));
  }

  addPluginPage(path, Component) {
    return this.setState({
      pluginData: {
        ...this.state.pluginData,
        pages: [...this.state.pluginData.pages, { path, Component }],
      }
    });
  }

  addPluginHomeButton(title, path) {
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
