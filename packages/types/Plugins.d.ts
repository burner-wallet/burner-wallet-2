import { ComponentType } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Asset } from '@burner-wallet/assets';
import Web3 from 'web3';
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

export type PluginPageContext<Params = {}> = RouteComponentProps<Params> & BasePluginContext & BurnerContext;
export type PluginElementContext = BasePluginContext & BurnerContext;

export type PluginPage = ComponentType<PluginPageContext<any>>;
export type PluginElement = ComponentType<PluginElementContext>;

export type AccountSearchFn = (query: string) => Promise<Account[]>;
export type AddressToNameResolver = (address: string) => Promise<string | null>;
export type QRScannedFn = (qr: string, context: PluginActionContext) => boolean | undefined;
export type TXSentFn = (data: SendData) => string | void | null;

export interface BurnerPluginContext {
  addElement: (position: string, Component: PluginElement, options?: any) => void;
  addButton: (position: string, title: string, path: string, options?: any) => any;
  addHomeButton: (title: string, path: string, options?: any) => any;
  addPage: (path: string, Component: PluginPage) => any;
  getAssets: () => Asset[];
  getWeb3: (network: string, options?: any) => Web3;
  addAddressToNameResolver: (callback: AddressToNameResolver) => void;
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

export interface BurnerPluginData {
  pages: PluginPageData[];
  buttons: { [position: string]: PluginButtonData[] };
  elements: { [position: string]: PluginElementData[] };
  accountSearches: AccountSearchFn[];
  tryHandleQR: (qr: string, context: PluginActionContext) => boolean;
  sent: TXSentFn;
  getAddressName: (address: string) => Promise<string | null>;
}
