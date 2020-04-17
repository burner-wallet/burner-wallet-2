import React, { ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AccountSearchFn, BurnerPluginContext, BurnerPluginData, Plugin, AddressToNameResolver,
  PluginActionContext, PluginElement, PluginPage, QRScannedFn, SendData, TXSentFn,
  PluginMessageListener, BurnerContext, Diff, Translations, PluginButtonData, StartupFn
} from '@burner-wallet/types';
export { BurnerPluginData } from '@burner-wallet/types';
import { withBurner, SubProvider } from './BurnerProvider';
import BurnerUICore from './BurnerUICore';
import i18n from './i18n';

const wrapComponent = <T extends BurnerContext>(Component: ComponentType<T>, plugin: Plugin) => {
  const WrappedComponent: React.FC<Diff<T, BurnerContext>> = (props) => {
    const { t } = useTranslation(plugin.id);
    const InnerWrappedComponent = withBurner(Component);
    return (
      <SubProvider t={t}>
        <InnerWrappedComponent plugin={plugin} {...props} />
      </SubProvider>
    );
  };
  return WrappedComponent;
}

export const DEFAULT_PLUGIN_DATA = {
  pages: [],
  buttons: {},
  elements: {},
  accountSearches: [],
  tryHandleQR: () => false,
  sent: () => null,
  getAddressName: () => Promise.resolve(null),
  startup: () => null,
};

export default class Plugins {
  private pluginData: BurnerPluginData;
  private ui: BurnerUICore;

  private changeListeners: ((data: BurnerPluginData) => void)[] = [];
  private qrHandlers: QRScannedFn[] = [];
  private startupListeners: StartupFn[] = [];
  private sentHandlers: TXSentFn[] = [];
  private addressToNameResolvers: AddressToNameResolver[] = [];
  private messageListeners: { [topic: string]: PluginMessageListener[] } = {};

  constructor(plugins: Plugin[], ui: BurnerUICore) {
    this.ui = ui;
    this.pluginData = {
      ...DEFAULT_PLUGIN_DATA,
      tryHandleQR: this.tryHandleQR.bind(this),
      sent: this.sent.bind(this),
      getAddressName: this.getAddressName.bind(this),
      startup: this.startup.bind(this),
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
      addElement: (position: string, Component: PluginElement, options?: any) =>
        this.addPluginElement(plugin, position, Component, options),
      onAccountSearch: (callback: AccountSearchFn) => this.addAccountSearch(callback),
      onQRScanned: (callback: QRScannedFn) => void this.qrHandlers.push(callback),
      onSent: (callback: TXSentFn) => void this.sentHandlers.push(callback),
      addPage: (path: string, Component: PluginPage) => this.addPluginPage(plugin, path, Component),
      addButton: (position: string, title: string, path: string, options?: any) =>
        this.addPluginButton(plugin, position, title, path, options),
      addHomeButton: (title: string, path: string, options?: any) =>
        this.addPluginButton(plugin, 'home', title, path, options),
      addAddressToNameResolver: (callback: AddressToNameResolver) =>
        this.addressToNameResolvers.push(callback),
      addTranslations: (translations: Translations) => this.addTranslations(plugin, translations),
      getAssets: () => this.ui.getAssets(),
      getWeb3: (network: string, options?: any) => this.ui.getCore().getWeb3(network, options),
      sendPluginMessage: (topic: string, ...message: any[]) =>
        (this.messageListeners[topic] || []).map((listener: PluginMessageListener) => listener(...message)),
      onPluginMessage: (topic: string, listener: PluginMessageListener) => this.addMessageListener(topic, listener),
      onStartup: (listener: StartupFn) => void this.startupListeners.push(listener),
    };
  }

  setPluginData(newData: Partial<BurnerPluginData>) {
    this.pluginData = {
      ...this.pluginData,
      ...newData,
    };
    this.changeListeners.forEach(listener => listener(this.pluginData));
  }

  addPluginPage(plugin: Plugin, path: string, Component: PluginPage) {
    const WrappedComponent = wrapComponent(Component, plugin);
    this.setPluginData({
      pages: [...this.pluginData.pages, { plugin, path, Component: WrappedComponent }],
    });
  }

  addPluginButton(plugin: Plugin, position: string, title: string, path: string, options: any) {
    const existingButtons = this.pluginData.buttons[position] || [];
    const newButton = { plugin, title, path, options };

    this.setPluginData({
      buttons: {
        ...this.pluginData.buttons,
        [position]: [...existingButtons, newButton],
      },
    });

    let hasRemoved = false;
    const remove = () => {
      if (hasRemoved) {
        throw new Error('This button has already been removed');
      }

      this.setPluginData({
        buttons: {
          ...this.pluginData.buttons,
          [position]: this.pluginData.buttons[position]
            .filter((button: PluginButtonData) => button !== newButton),
        },
      });

      hasRemoved = true;
    };
    return { remove };
  }

  addPluginElement(plugin: Plugin, position: string, Component: PluginElement, options?: any) {
    const WrappedComponent = wrapComponent(Component, plugin);
    const existingElements = this.pluginData.elements[position] || [];
    this.setPluginData({
      elements: {
        ...this.pluginData.elements,
        [position]: [...existingElements, { plugin, Component: WrappedComponent, options }],
      },
    });
  }

  addTranslations(plugin: Plugin, translations: Translations) {
    if (!plugin.id) {
      throw new Error('Can not add translations without plugin ID');
    }
    Object.entries(translations)
      .forEach(([lang, resources]) => i18n.addResources(lang, plugin.id!, resources));
  }

  addAccountSearch(callback: AccountSearchFn) {
    this.setPluginData({
      accountSearches: [...this.pluginData.accountSearches, callback],
    });
  }

  addMessageListener(topic: string, callback: PluginMessageListener) {
    this.messageListeners[topic] = [...(this.messageListeners[topic] || []), callback];
  }

  async getAddressName(address: string) {
    for (const resolver of this.addressToNameResolvers) {
      const name = await resolver(address);
      if (name) {
        return name;
      }
    }
    return null;
  }

  tryHandleQR(qr: string, context: PluginActionContext) {
    for (const handler of this.qrHandlers) {
      if (handler(qr, context)) {
        return true;
      }
    }
    return false;
  }

  startup(context: PluginActionContext) {
    for (const handler of this.startupListeners) {
      handler(context);
    }
  }

  sent(data: SendData) {
    let redirect = null;
    for (const listener of this.sentHandlers) {
      const response = listener(data);
      if (!redirect && response && response.length) {
        redirect = response;
      }
    }
    return redirect;
  }
}
