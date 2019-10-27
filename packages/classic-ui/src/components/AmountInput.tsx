import React from 'react';
import { Asset } from '@burner-wallet/assets';
const classes = require('./AmountInput.module.css');

const ONE_ETH = 1000000000000000000;

export interface AmountInputProps {
  onChange: (val: string, isMax: boolean) => void;
  asset?: Asset | null;
  value: string;
  disabled?: boolean;
  max?: string | null;
}

const AmountInput: React.FC<AmountInputProps> = ({ onChange, asset, value, disabled, max }) => {
  let isUSD = false;
  let usdValue;
  if (!isUSD && asset) {
    try {
      isUSD = asset.getUSDValue(ONE_ETH.toString()) === '1.00';
      usdValue = asset.getUSDValue((parseFloat(value) * ONE_ETH).toString());
    } catch (e) {}
  }
  return (
    <div>
      <div className={classes.inputContainer}>
        {isUSD && <div className={classes.unit}>$</div>}
        <input
          type="number"
          placeholder="0.00"
          className={classes.input}
          onChange={e => onChange(e.target.value, false)}
          value={value}
          disabled={disabled}
          min="0"
          max={max || undefined}
        />
        {!isUSD && asset && <div className={classes.unit}>{asset.name}</div>}
        {max && (
          <div className={classes.maxBtn} onClick={() => onChange(max, true)}>Max</div>
        )}
      </div>
      {usdValue && <div>${usdValue} USD</div>}
    </div>
  );
};

export default AmountInput;
