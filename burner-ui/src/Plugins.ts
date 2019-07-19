import { ComponentType } from 'react';
import { Asset } from '@burner-wallet/assets';
import { RouteComponentProps } from 'react-router-dom';
import { withBurner } from './BurnerProvider';
import BurnerUI from './BurnerUI';
import { Plugin, PluginPage, BasePluginContext, PluginElement } from './';

interface PluginPageData {
  path: string,
  Component: ComponentType<BasePluginContext & RouteComponentProps>,
  plugin: Plugin,
}

export interface PluginElementData {
  Component: ComponentType<BasePluginContext>,
  plugin: Plugin,
}

interface PluginHomeButton {
  title: string,
  path: string,
}

type AccountSearchFn = (query: string) => Promise<Account[]>;

export interface BurnerPluginData {
  pages: PluginPageData[],
  homeButtons: PluginHomeButton[],
  elements: { [position:string]: PluginElementData[] },
  accountSearches: AccountSearchFn[], 
}

export interface BurnerPluginContext {
  addElement: (position: string, Component: PluginElement) => void,
  addHomeButton: (title: string, path: string) => any,
  addPage: (path: string, Component: PluginPage) => any,
  getAssets: () => Asset[],
  getWeb3: (network: string, options?: any) => any,
  onAccountSearch: (callback: AccountSearchFn) => void,
}

export const DEFAULT_PLUGIN_DATA = {
  pages: [],
  homeButtons: [],
  elements: {},
  accountSearches: [],
};

export default class Plugins {
  private changeListeners: ((data: BurnerPluginData) => void)[];
  private pluginData: BurnerPluginData;
  private ui: BurnerUI;

  constructor(plugins: Plugin[], ui: BurnerUI) {
    this.changeListeners = [];
    this.ui = ui;
    this.pluginData = DEFAULT_PLUGIN_DATA;

    plugins.forEach(plugin => plugin.initializePlugin(this.getPluginContext(plugin)));
  }

  onDataChange(listener: (data: BurnerPluginData) => void) {
    this.changeListeners.push(listener);
  }

  getData() {
    return this.pluginData;
  }

  getPluginContext(plugin: Plugin): BurnerPluginContext {
    return {
      addElement: (position: string, Component: PluginElement) =>
        this.addPluginElement(plugin, position, Component),
      onAccountSearch: (callback: AccountSearchFn) => this.addAccountSearch(callback),
      addPage: (path: string, Component: PluginPage) => this.addPluginPage(plugin, path, Component),
      addHomeButton: (title: string, path: string) => this.addPluginHomeButton(plugin, title, path),
      getAssets: () => this.ui.getAssets(),
      getWeb3: (network: string, options?: any) => this.ui.getCore().getWeb3(network, options),
    };
  }

  setPluginData(newData: any) {
    this.pluginData = {
      ...this.pluginData,
      ...newData,
    };
    this.changeListeners.forEach(listener => listener(this.pluginData));
  }

  addPluginPage(plugin: Plugin, path: string, Component: PluginPage) {
    const WrappedComponent = withBurner(Component);
    this.setPluginData({
      pages: [...this.pluginData.pages, { plugin, path, Component: WrappedComponent }],
    });
  }

  addPluginHomeButton(plugin: Plugin, title: string, path: string) {
    this.setPluginData({
      homeButtons: [...this.pluginData.homeButtons, { plugin, title, path }],
    });
  }

  addPluginElement(plugin: Plugin, position: string, Component: PluginElement) {
    const WrappedComponent = withBurner(Component);
    const existingElements = this.pluginData.elements[position] || [];
    this.setPluginData({
      elements: {
        ...this.pluginData.elements,
        [position]: [...existingElements, { plugin, Component: WrappedComponent }],
      },
    });
  }

  addAccountSearch(callback: AccountSearchFn) {
    this.setPluginData({
      accountSearches: [...this.pluginData.accountSearches, callback],
    });
  }
}
