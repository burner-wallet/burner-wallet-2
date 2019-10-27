import { ComponentType, ReactNode } from 'react';
import { Asset } from '@burner-wallet/assets';

export interface PageProps {
  children: ReactNode;
  title?: string;
}

export interface AssetSelectorProps {
  selected: Asset | null;
  assets?: Asset[];
  onChange: (asset: Asset) => void;
  network?: string;
  disabled?: boolean;
}

export interface AmountInputProps {
  onChange: (val: string, isMax: boolean) => void;
  asset?: Asset | null;
  value: string;
  disabled?: boolean;
  max?: string | null;
}

export interface ButtonProps {
  to?: string;
  onClick?: () => any;
  disabled?: boolean;
  className?: string;
}

export interface QRCodeProps {
  value: string;
  renderAs?: 'canvas' | 'svg';
}

export default interface BurnerUIComponents {
  Page: ComponentType<PageProps>;
  AssetSelector: ComponentType<AssetSelectorProps>;
  AmountInput: ComponentType<AmountInputProps>;
  Button: ComponentType<ButtonProps>;
  QRCode: ComponentType<QRCodeProps>;
}
