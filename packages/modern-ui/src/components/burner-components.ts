import { BurnerUIComponents } from '@burner-wallet/types';
import Page from './Page';
import AmountInput from './AmountInput';
import AssetSelector from './AssetSelector';
import Button from './Button';
import { QR as QRCode } from 'rimble-ui';

const components: BurnerUIComponents = {
  Page,
  AssetSelector,
  AmountInput,
  Button,
  QRCode,
};

export default components;
