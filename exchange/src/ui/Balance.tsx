import React, { Component } from 'react';
import classes from './Balance.module.css';

const getAsset = (id, assets) => {
  for (const asset of assets) {
    if (asset.id === id) {
      return asset;
    }
  }
  throw new Error(`Could not find asset ${id}`);
}

const Balance = ({ assetId, assets, balances }) => {
  const asset = getAsset(assetId, assets);

  return (
    <div className={classes.balance}>
      <div>{asset.name}</div>
      <div className={classes.balanceVal}>{balances[asset.id]} {asset.name}</div>
    </div>
  );
}

export default Balance;
