import React, { Component } from 'react';
import { Asset } from '@burner-wallet/assets';
import { withBurner, BurnerContext } from '../BurnerProvider';

const POLL_INTERVAL = 1000;
const CACHE_EXPIRATION = 3000;

const balanceCache: { [key: string]: { timestamp: number, balance: string } } = {};
const getCache = (key: string) => balanceCache[key] && (Date.now() - balanceCache[key].timestamp < CACHE_EXPIRATION)
  ? balanceCache[key].balance
  : null;
const setCache = (key: string, balance: string) => {
  balanceCache[key] = { balance, timestamp: Date.now() };
}

export interface AccountBalanceProps extends BurnerContext {
  asset: string | Asset,
  account?: string,
  render: (err: Error, data: AccountBalanceData | null) => React.ReactNode,
}

export interface AccountBalanceData {
  balance: string,
  displayBalance: string,
  usdBalance: string | null,
}

class AccountBalance extends Component<AccountBalanceProps, any> {
  private timer: any;
  private _isMounted: boolean;

  constructor(props: BurnerContext & AccountBalanceProps) {
    super(props);
    this.state = {
      data: null,
      err: null,
    };
    this.timer = null;
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;
    this.fetchData();
    this.poll();
  }

  componentDidUpdate(oldProps: BurnerContext & AccountBalanceProps) {
    if (this.props !== oldProps) {
      this.fetchData();
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  poll() {
    this.timer = setTimeout(async () => {
      await this.fetchData();
      this.poll();
    }, POLL_INTERVAL);
  }

  getAsset(): Asset {
    const { asset, assets } = this.props;
    if (typeof asset !== 'string') {
      return asset;
    }

    const assetList = assets.filter(_asset => _asset.id == asset);
    if (assetList.length == 0) {
      throw new Error(`Unable to find asset ${asset}`);
    }
    return assetList[0];
  }

  async getBalance(asset: Asset) {
    const account = this.props.account || this.props.defaultAccount;
    const cacheKey = `${asset.id}-${account}`;
    const cachedVal = getCache(cacheKey);
    if (cachedVal) {
      return cachedVal;
    }

    const balance = await asset.getBalance(account);
    setCache(cacheKey, balance);
    return balance;
  }

  async fetchData() {
    try {
      const asset = this.getAsset();
      const balance = await this.getBalance(asset);

      if (!this._isMounted) {
        return;
      }

      let usdBalance = null;
      try {
        usdBalance = asset.getUSDValue(balance);
      } catch (e) {}

      const data: AccountBalanceData = {
        balance,
        displayBalance: asset.getDisplayValue(balance),
        usdBalance,
      }
      this.setState({ data, err: null });
    } catch (err) {
      console.warn(err);
      this.setState({ err, data: null });
    }
  }

  render() {
    return this.props.render(this.state.err, this.state.data);
  }
}

export default withBurner<AccountBalanceProps>(AccountBalance);
