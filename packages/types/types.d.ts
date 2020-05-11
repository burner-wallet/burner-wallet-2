import { ComponentType } from 'react';
import { Asset } from '@burner-wallet/assets';
export { Asset } from '@burner-wallet/assets';
import { HistoryEvent } from '@burner-wallet/core';
export { HistoryEvent } from '@burner-wallet/core';
import { TFunction } from 'i18next';

import BurnerUIComponents from './BurnerUIComponents';
export { default as BurnerUIComponents } from './BurnerUIComponents';
import DataProviders from './DataProviders';
export { default as DataProviders } from './DataProviders';
import { BurnerPluginData } from './Plugins';

export {
  PageProps, AssetSelectorProps, AmountInputProps, ButtonProps, QRCodeProps
} from './BurnerUIComponents';

export {
  AccountBalanceProps, AccountBalanceData, AccountKeysProps, Keys, AssetsProps,
  HistoryProps, PluginButtonsProps, PluginElementsProps, TransactionDetailsProps,
  AddressNameProps
} from './DataProviders';

export {
  Plugin, PluginActionContext, PluginPageContext, PluginElementContext, PluginPage, PluginElement,
  PluginElementData, AccountSearchFn, QRScannedFn, TXSentFn, BurnerPluginContext, BurnerPluginData,
  PluginButtonProps, PluginButtonData, AddressToNameResolver, PluginMessageListener, Translations,
  PluginButtonActions, StartupFn
} from './Plugins';

export type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
export type Diff<T, K> = Omit<T, keyof K>;

export interface Account {
  name?: string;
  address: string;
  picture?: string;
}

export interface Actions {
  callSigner: (action: string, ...props: any[]) => string;
  canCallSigner: (action: string, ...props: any[]) => boolean;
  openDefaultQRScanner: () => Promise<void>;
  scanQRCode: () => Promise<string>;
  safeSetPK: (newPK: string) => void;
  send: (params: SendData) => void;
  navigateTo: (location: string | number, state?: any) => void;
  setLoading: (status: string | null) => void;
  getHistoryEvents: (options?: any) => HistoryEvent[];
  onHistoryEvent: (callback: HistoryEventCallback) => void;
  removeHistoryEventListener: (callback: HistoryEventCallback) => void;
}

export interface BurnerContext {
  actions: Actions;
  accounts: string[];
  defaultAccount: string;
  assets: Asset[];
  BurnerComponents: BurnerComponents;
  // depricated:
  burnerComponents: BurnerComponents;
  pluginData: BurnerPluginData;
  completeScan: ((result: string | null) => any) | null;
  loading: string | null;
  t: TFunction;
}

export type BurnerComponents = BurnerUIComponents & DataProviders;

export type HistoryEventCallback = (event: HistoryEvent) => void;

export interface Page {
  path: string | string[];
  component: ComponentType<any>;
  exact?: boolean;
}

export interface SendData {
  asset: string;
  ether?: string;
  value?: string;
  to: string;
  from?: string;
  message?: string | null;
  id?: string | null;
  hash?: string;
  receipt?: any;
  timestamp?: number;
}
