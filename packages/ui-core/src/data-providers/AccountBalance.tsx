import React, { Fragment, useState, useEffect, useRef } from 'react';
import { Asset, AccountBalanceProps, AccountBalanceData } from '@burner-wallet/types';
import { useBurner } from '../BurnerProvider';

const POLL_INTERVAL = 1000;
const CACHE_EXPIRATION = 3000;

interface BalanceCache {
  balance: string;
  maximumSendableBalance: string;
  growthRate: string;
}

const balanceCache: { [key: string]: BalanceCache & { timestamp: number } } = {};
const getCache = (key: string) => balanceCache[key] && (Date.now() - balanceCache[key].timestamp < CACHE_EXPIRATION)
  ? balanceCache[key]
  : null;
const setCache = (key: string, val: BalanceCache) => {
  balanceCache[key] = { ...val, timestamp: Date.now() };
}

const getBalance = async (asset: Asset, account: string) => {
  const cacheKey = `${asset.id}-${account}`;
  const cachedVal = getCache(cacheKey);
  if (cachedVal) {
    return cachedVal;
  }

  const [balance, maximumSendableBalance, growthRate] = await Promise.all([
    asset.getBalance(account),
    asset.getMaximumSendableBalance(account),
    asset.getGrowthRate ? asset.getGrowthRate(account) : Promise.resolve('0'),
  ]);
  const returnVal = { balance, maximumSendableBalance, growthRate };

  setCache(cacheKey, returnVal);
  return returnVal;
};

const AccountBalance: React.FC<AccountBalanceProps> = ({ render, asset, account }) => {
  const [data, setData] = useState<AccountBalanceData | null>(null);
  const dataRef = useRef<AccountBalanceData | null>(null);
  const _isMounted = useRef(true);
  const timer = useRef<number | null>(null);

  const { assets, defaultAccount } = useBurner();
  const _account = account || defaultAccount;

  const getAsset = () => {
    if (typeof asset !== 'string') {
      return asset;
    }

    const assetList = assets.filter(_asset => _asset.id == asset);
    if (assetList.length == 0) {
      throw new Error(`Unable to find asset ${asset}`);
    }
    return assetList[0];
  };

  const fetchData = async () => {
    try {
      const _asset = getAsset();
      const { balance, maximumSendableBalance, growthRate } = await getBalance(_asset, _account);

      if (!_isMounted.current) {
        return;
      }

      let usdBalance = null;
      try {
        usdBalance = _asset.getUSDValue(balance);
      } catch (e) {}

      const _data: AccountBalanceData = {
        asset: _asset,
        balance,
        displayBalance: _asset.getDisplayValue(balance),
        maximumSendableBalance,
        displayMaximumSendableBalance: _asset.getDisplayValue(maximumSendableBalance),
        usdBalance,
        growthRate,
      };

      if (!dataRef.current
        || _data.balance !== dataRef.current.balance
        || _data.usdBalance !== dataRef.current.usdBalance) {
        setData(_data);
        dataRef.current = _data;
      }
    } catch (err) {
      console.warn('[AccountBalance]', err);
    }
  };

  useEffect(() => {
    fetchData();

    let running = true;
    const poll = async () => {
      await fetchData();
      if (running) {
        timer.current = window.setTimeout(poll, POLL_INTERVAL);
      }
    };
    poll();

    return () => {
      running = false;
      if (timer.current) {
        window.clearTimeout(timer.current);
      }
    };
  }, [_account, asset]);

  useEffect(() => {
    return () => {
      _isMounted.current = false;
    };
  }, []);

  return (
    <Fragment>
      {render(data)}
    </Fragment>
  );
}

export default AccountBalance;
