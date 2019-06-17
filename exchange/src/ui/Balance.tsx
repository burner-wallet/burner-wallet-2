import React, { Component } from 'react';
import { Asset } from '@burner-wallet/assets';
const classes = require('./Balance.module.css');

const getAsset = (id: string, assets: Asset[]): Asset => {
  for (const asset of assets) {
    if (asset.id === id) {
      return asset;
    }
  }
  throw new Error(`Could not find asset ${id}`);
}

interface BalanceProps {
  assetId: string,
  assets: Asset[],
  balances: { [index:string] : string },
}

const Balance: React.FC<BalanceProps> = ({ assetId, assets, balances }) => {
  const asset = getAsset(assetId, assets);

  return (
    <div className={classes.balance}>
      <div>{asset.name}</div>
      <div className={classes.balanceVal}>{balances[asset.id]} {asset.name}</div>
    </div>
  );
}

export default Balance;
