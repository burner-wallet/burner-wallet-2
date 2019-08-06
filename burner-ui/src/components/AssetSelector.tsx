import React, { useState, useEffect } from 'react';
import { Asset } from '@burner-wallet/assets';
import AccountBalance, { AccountBalanceData } from '../data-providers/AccountBalance';
import Assets from '../data-providers/Assets';
const classes = require('./AssetSelector.module.css');

const AssetElement: React.FC<{asset: Asset}> = ({ asset }) => (
  <div className={classes.assetElement}>
    <div className={classes.assetName}>{asset.name}</div>
    <AccountBalance asset={asset} render={(err: Error, data: AccountBalanceData | null) => data && (
      <div className={classes.assetBalance}>
        {data.usdBalance ? `$${data.usdBalance}` : data.displayBalance}
      </div>
    )} />
  </div>
);

export interface AssetSelectorProps {
  selected: Asset | null;
  assets?: Asset[],
  onChange: (asset: Asset) => void;
  network?: string;
  disabled?: boolean;
}

const AssetSelector: React.FC<AssetSelectorProps> = ({ selected, assets, onChange, disabled, network }) => {
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    const clickListener = () => setOpen(false);
    document.addEventListener('click', clickListener);
    return () => document.removeEventListener('click', clickListener);
  });

  const Dropdown = (assets: Asset[]) => {
    if (!selected) {
      onChange(assets[0]);
    }
    const selectedAsset = assets.filter(asset => asset === selected)[0];
    return (
      <div className={classes.selectContainer}>
        <div onClick={() => setOpen(!isOpen)} className={classes.selectBox}>
          {selectedAsset && <AssetElement asset={selectedAsset} />}
        </div>
        {isOpen && !disabled && (
          <div className={classes.selectDropdown}>
            {assets.filter(asset => !network || asset.network === network).map(asset => (
              <div key={asset.id} className={classes.dropdownItem} onClick={() => {
                setOpen(false);
                onChange(asset);
              }}>
                <AssetElement asset={asset} />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return assets ? Dropdown(assets) : <Assets render={Dropdown} />;
};

export default AssetSelector;
