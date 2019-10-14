import { ComponentType } from 'react';
import QRCode from 'qrcode.react';

import Page, { PageProps } from './Page';
import AmountInput, { AmountInputProps } from './AmountInput';
import AssetSelector, { AssetSelectorProps } from './AssetSelector';
import Button, { ButtonProps } from './Button';

import AccountBalance, { AccountBalanceProps } from '../data-providers/AccountBalance';
import AccountKeys, { AccountKeysProps } from '../data-providers/AccountKeys';
import Assets, { AssetsProps } from '../data-providers/Assets';
import TransactionDetails, { TransactionDetailsProps } from '../data-providers/TransactionDetails';

export interface BurnerComponents {
  Page: typeof Page,
  AssetSelector: typeof AssetSelector,
  AmountInput: typeof AmountInput,
  Button: typeof Button,

  AccountBalance: typeof AccountBalance,
  AccountKeys: typeof AccountKeys,
  Assets: typeof Assets,
  TransactionDetails: typeof TransactionDetails,

  QRCode: QRCode.QRCode,
};

export default {
  Page, AssetSelector, AmountInput, Button,
  AccountBalance, AccountKeys, Assets, TransactionDetails,
  QRCode,
} as BurnerComponents;
