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
  balance: string;
  displayBalance: string;
  maximumSendableBalance: string;
  displayMaximumSendableBalance: string;
  usdBalance: string | null;
}

export interface AccountKeysProps {
  account: string;
  render: (keys: Keys | null) => React.ReactNode;
}

export interface Keys {
  privateKey: string;
  burnAccount: () => any;
}

export interface AssetsProps {
  render: (assets: Asset[]) => ReactNode;
}

export interface HistoryProps {
  account: string;
  render: (events: HistoryEvent[]) => ReactNode;
}

export interface PluginElementsProps {
  position: string;
}

export interface PluginButtonsProps {
  position: string;
  component?: ComponentType<PluginButtonProps>;
}

export interface TransactionDetailsProps {
  asset: string;
  txHash: string;
  render: (tx: SendData) => ReactNode;
}

export default interface DataProviders {
  AccountBalance: ComponentType<AccountBalanceProps>;
  AccountKeys: ComponentType<AccountKeysProps>;
  Assets: ComponentType<AssetsProps>;
  History: ComponentType<HistoryProps>;
  PluginButtons: ComponentType<PluginButtonsProps>;
  PluginElements: ComponentType<PluginElementsProps>;
  TransactionDetails: ComponentType<TransactionDetailsProps>;
}
