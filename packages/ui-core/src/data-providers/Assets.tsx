import React, { Fragment } from 'react';
import { Asset } from '@burner-wallet/assets';
import { withBurner, BurnerContext } from '../BurnerProvider';

export interface AssetsProps extends BurnerContext {
  render: (assets: Asset[]) => React.ReactNode;
}

const Assets: React.FC<AssetsProps> = ({ render, assets }) => (
  <Fragment>{render(assets)}</Fragment>
);

export default withBurner<AssetsProps>(Assets);
