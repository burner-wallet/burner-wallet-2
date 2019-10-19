import React, { Fragment } from 'react';
import { Asset } from '@burner-wallet/assets';
import { withBurner, BurnerContext } from '../BurnerProvider';
import { AssetsProps } from '@burner-wallet/types';

const Assets: React.FC<AssetsProps & BurnerContext> = ({ render, assets }) => (
  <Fragment>{render(assets)}</Fragment>
);

export default withBurner(Assets);
