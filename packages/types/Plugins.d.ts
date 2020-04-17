import { ComponentType } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Location } from 'history';
import { Asset } from '@burner-wallet/assets';
import Web3 from 'web3';
import { Account, Actions, BurnerContext, SendData } from './types';

interface BasePluginContext<P = Plugin> {
  plugin: P;
}

export interface Plugin {
  id?: string;

  initializePlugin(context: BurnerPluginContext): void;
}

export interface PluginActionContext {
  actions: Actions;
  location: Location;
}

export type PluginElementContext<P = Plugin> = BasePluginContext<P> & BurnerContext;
export type PluginPageContext<Params = {}, P = Plugin> =
  RouteComponentProps<Params> & BasePluginContext<P> & BurnerContext;

export type PluginPage = ComponentType<PluginPageContext<any, any>>;
export type PluginElement = ComponentType<PluginElementContext<any>>;

export type AccountSearchFn = (query: string) => Promise<Account[]>;
export type AddressToNameResolver = (address: string) => Promise<string | null>;
export type QRScannedFn = (qr: string, context: PluginActionContext) => boolean | undefined;
export type TXSentFn = (data: SendData) => string | void | null;
export type PluginMessageListener = (...message: any[]) => any;
export type StartupFn = (context: PluginActionContext) => void;

export type Translations = { [lang: string]: { [key: string]: string } };

export interface BurnerPluginContext {
  addElement: (position: string, Component: PluginElement, options?: any) => void;
  addButton: (position: string, title: string, path: string, options?: any) => PluginButtonActions;
  addHomeButton: (title: string, path: string, options?: any) => any;
  addPage: (path: string, Component: PluginPage) => any;
  addTranslations: (translations: Translations) => void;
  getAssets: () => Asset[];
  getWeb3: (network: string, options?: any) => Web3;
  addAddressToNameResolver: (callback: AddressToNameResolver) => void;
  onAccountSearch: (callback: AccountSearchFn) => void;
  onQRScanned: (callback: QRScannedFn) => void;
  onSent: (callback: TXSentFn) => void;
  sendPluginMessage: (topic: string, ...message: any[]) => any[];
  onPluginMessage: (topic: string, listener: PluginMessageListener) => void;
  onStartup: (callback: StartupFn) => void;
}

interface PluginPageData {
  path: string;
  Component: ComponentType<BasePluginContext & RouteComponentProps>;
  plugin: Plugin;
}

export interface PluginElementData {
  Component: ComponentType<BasePluginContext>;
  plugin: Plugin;
  options?: any;
}

export interface PluginButtonData {
  plugin: Plugin;
  title: string;
  path: string;
  options?: any;
}

export interface PluginButtonProps {
  to: string;
  title: string;
  options?: any;
}

export interface PluginButtonActions {
  remove: () => void;
}

export interface BurnerPluginData {
  pages: PluginPageData[];
  buttons: { [position: string]: PluginButtonData[] };
  elements: { [position: string]: PluginElementData[] };
  accountSearches: AccountSearchFn[];
  tryHandleQR: (qr: string, context: PluginActionContext) => boolean;
  sent: TXSentFn;
  getAddressName: (address: string) => Promise<string | null>;
  startup: (context: PluginActionContext) => void;
}
