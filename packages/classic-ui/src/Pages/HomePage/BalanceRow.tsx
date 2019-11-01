import React from 'react';
import injectSheet from 'react-jss';
import { Asset } from '@burner-wallet/types';

interface BalanceRowProps {
  asset: Asset;
  usdBalance?: string | null;
  balance?: string | null;
  classes: any;
}

const styles = {
  balanceRow: {
    display: 'flex',
    alignItems: 'center',
    padding: 10,
    borderBottom: 'solid 1px #e0e0e0',
  },
  assetName: {
    flex: '1 0',
    color: '#919191',
  },
  assetBalance: {
    fontSize: 40,
  },
};

const BalanceRow: React.FC<BalanceRowProps> = ({ asset, usdBalance, balance, classes }) => (
  <li className={classes.balanceRow}>
    <div className={classes.assetName}>{asset.name}</div>
    <div className={classes.assetBalance}>
      {!(usdBalance || balance) && '-'}
      {usdBalance ? `$${usdBalance}` : balance}
    </div>
  </li>
);

export default injectSheet(styles)(BalanceRow);
