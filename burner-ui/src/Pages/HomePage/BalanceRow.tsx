import React from 'react';
import { Asset } from '@burner-wallet/assets';
const classes = require('./BalanceRow.module.css');

interface BalanceRowProps {
  asset: Asset,
  usdBalance?: string | null,
  balance?: string | null,
}

const BalanceRow: React.FC<BalanceRowProps> = ({ asset, usdBalance, balance }) => (
  <li className={classes.balanceRow}>
    <div className={classes.assetName}>{asset.name}</div>
    <div className={classes.assetBalance}>
      {!(usdBalance || balance) && '-'}
      {usdBalance ? `$${usdBalance}` : balance}
    </div>
  </li>
);

export default BalanceRow;
