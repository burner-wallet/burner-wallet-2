import { ComponentType } from 'react';
import { Asset } from '@burner-wallet/assets';
import BurnerProvider, { BurnerContext } from './BurnerProvider';
import BurnerUI from './BurnerUI';

export interface Plugin {
  initializePlugin(context: BurnerPluginContext): void;
}

export interface BasePluginPageContext {
  plugin: Plugin;
}

export type PluginPageContext = BasePluginPageContext & BurnerContext;

export type PluginPage = ComponentType<PluginPageContext>;

interface PluginPageData {
  path: string,
  Component: PluginPage,
  plugin: Plugin,
}

interface PluginHomeButton {
  title: string,
  path: string,
}

export interface BurnerPluginData {
  pages: PluginPageData[],
  homeButtons: PluginHomeButton[],
}

export interface BurnerPluginContext {
  addPage: (path: string, Component: PluginPage) => any,
  addHomeButton: (title: string, path: string) => any,
  getAssets: () => Asset[],
  getWeb3: (network: string) => any,
}

export default class Plugins {
  private changeListeners: ((data: BurnerPluginData) => void)[];
  private pluginData: BurnerPluginData;
  private ui: BurnerUI;

  constructor(plugins: Plugin[], ui: BurnerUI) {
    this.changeListeners = [];
    this.ui = ui;
    this.pluginData = {
      pages: [],
      homeButtons: [],
    };

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
      addPage: (path: string, Component: PluginPage) => this.addPluginPage(plugin, path, Component),
      addHomeButton: (title: string, path: string) => this.addPluginHomeButton(plugin, title, path),
      getAssets: () => this.ui.getAssets(),
      getWeb3: (network: string) => this.ui.getCore().getWeb3(network),
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
    this.setPluginData({
      pages: [...this.pluginData.pages, { plugin, path, Component }],
    });
  }

  addPluginHomeButton(plugin: Plugin, title: string, path: string) {
    this.setPluginData({
      homeButtons: [...this.pluginData.homeButtons, { plugin, title, path }],
    });
  }
}
