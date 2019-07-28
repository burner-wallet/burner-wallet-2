import { ComponentType } from 'react';
import QRCode from 'qrcode.react';

import Page, { PageProps } from './Page';
import AssetSelector, { AssetSelectorProps } from './AssetSelector';

import AccountBalance, { AccountBalanceProps } from '../data-providers/AccountBalance';
import AccountKeys, { AccountKeysProps } from '../data-providers/AccountKeys';
import Assets, { AssetsProps } from '../data-providers/Assets';
import TransactionDetails, { TransactionDetailsProps } from '../data-providers/TransactionDetails';

export interface BurnerComponents {
  Page: ComponentType<PageProps>,
  AssetSelector: ComponentType<AssetSelectorProps>,

  AccountBalance: ComponentType<AccountBalanceProps>,
  AccountKeys: ComponentType<AccountKeysProps>,
  Assets: ComponentType<AssetsProps>,
  TransactionDetails: ComponentType<TransactionDetailsProps>,

  QRCode: QRCode.QRCode,
};

export default {
  Page, AssetSelector,
  AccountBalance, AccountKeys, Assets, TransactionDetails,
  QRCode,
} as BurnerComponents;
