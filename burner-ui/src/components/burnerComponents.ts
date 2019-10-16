import { ComponentType } from 'react';
import QRCode from 'qrcode.react';

import Page from './Page';
import AmountInput from './AmountInput';
import AssetSelector from './AssetSelector';
import Button from './Button';

import AccountBalance from '../data-providers/AccountBalance';
import AccountKeys from '../data-providers/AccountKeys';
import Assets from '../data-providers/Assets';
import TransactionDetails from '../data-providers/TransactionDetails';

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
