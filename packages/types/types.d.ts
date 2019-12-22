import { ComponentType } from 'react';
import { Asset } from '@burner-wallet/assets';
import HistoryEvent from '@burner-wallet/core/HistoryEvent';

import BurnerUIComponents from './BurnerUIComponents';
import DataProviders from './DataProviders';
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
  PluginButtonProps, PluginButtonData, AddressToNameResolver, PluginMessageListener
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
}

export type Asset = Asset;
export type HistoryEvent = HistoryEvent;
export type BurnerUIComponents = BurnerUIComponents;
export type DataProviders = DataProviders;
export type BurnerComponents = BurnerUIComponents & DataProviders;

export type HistoryEventCallback = (event: HistoryEvent) => void;

export interface Page {
  path: string;
  component: ComponentType<any>;
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
