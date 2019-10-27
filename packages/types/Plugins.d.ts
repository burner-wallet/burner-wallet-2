import { ComponentType } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Asset } from '@burner-wallet/assets';
import { Account, Actions, BurnerContext, SendData } from './types';

interface BasePluginContext {
  plugin: Plugin;
}

export interface Plugin {
  initializePlugin(context: BurnerPluginContext): void;
}

interface PluginActionContext {
  actions: Actions;
}

export type PluginPageContext = RouteComponentProps & BasePluginContext & BurnerContext;
export type PluginElementContext = BasePluginContext & BurnerContext;

export type PluginPage = ComponentType<PluginPageContext>;
export type PluginElement = ComponentType<PluginElementContext>;

export type AccountSearchFn = (query: string) => Promise<Account[]>;
export type QRScannedFn = (qr: string, context?: PluginActionContext) => boolean;
export type TXSentFn = (data: SendData) => string | void | null;

export interface BurnerPluginContext {
  addElement: (position: string, Component: PluginElement, options?: any) => void;
  addButton: (position: string, title: string, path: string, options?: any) => any;
  addHomeButton: (title: string, path: string, options?: any) => any;
  addPage: (path: string, Component: PluginPage) => any;
  getAssets: () => Asset[];
  getWeb3: (network: string, options?: any) => any;
  onAccountSearch: (callback: AccountSearchFn) => void;
  onQRScanned: (callback: QRScannedFn) => void;
  onSent: (callback: TXSentFn) => void;
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

export interface PluginButton {
  plugin: Plugin;
  title: string;
  path: string;
  options?: any;
}

export interface BurnerPluginData {
  pages: PluginPageData[];
  buttons: { [position: string]: PluginButton[] };
  elements: { [position: string]: PluginElementData[] };
  accountSearches: AccountSearchFn[];
  tryHandleQR: (qr: string, context: PluginActionContext) => boolean;
  sent: TXSentFn;
}
