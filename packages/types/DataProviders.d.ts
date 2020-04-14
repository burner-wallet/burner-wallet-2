import { ComponentType, ReactNode } from 'react';
import { Asset } from '@burner-wallet/assets';
import HistoryEvent from '@burner-wallet/core/HistoryEvent';
import { SendData } from './types';
import { PluginButtonProps } from './Plugins';

export interface AccountBalanceProps {
  asset: string | Asset;
  account?: string;
  render: (data: AccountBalanceData | null) => ReactNode;
}

export interface AccountBalanceData {
  asset: Asset;
  balance: string;
  displayBalance: string;
  maximumSendableBalance: string;
  displayMaximumSendableBalance: string;
  usdBalance: string | null;
  growthRate: string;
}

export interface AccountKeysProps {
  account: string;
  render: (keys: Keys | null) => ReactNode;
}

export interface AddressNameProps {
  address: string;
  render: (name: string | null, address: string) => ReactNode;
}

export interface Keys {
  privateKey: string;
  burnAccount: () => any;
}

export interface AssetsProps {
  render: (assets: Asset[]) => ReactNode;
}

export interface HistoryProps {
  account?: string;
  render: (events: HistoryEvent[]) => ReactNode;
}

export interface PluginElementsProps {
  position: string;
  [x: string]: any;
}

export interface PluginButtonsProps {
  position: string;
  component?: ComponentType<PluginButtonProps>;
  [x: string]: any;
}

export interface TransactionDetailsProps {
  asset: string;
  txHash: string;
  render: (tx: SendData) => ReactNode;
}

export default interface DataProviders {
  AccountBalance: ComponentType<AccountBalanceProps>;
  AccountKeys: ComponentType<AccountKeysProps>;
  AddressName: ComponentType<AddressNameProps>;
  Assets: ComponentType<AssetsProps>;
  History: ComponentType<HistoryProps>;
  PluginButtons: ComponentType<PluginButtonsProps>;
  PluginElements: ComponentType<PluginElementsProps>;
  TransactionDetails: ComponentType<TransactionDetailsProps>;
}
