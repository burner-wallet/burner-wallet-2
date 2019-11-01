import { Component } from 'react';
import { Asset, AccountBalanceProps, AccountBalanceData } from '@burner-wallet/types';
import { withBurner, BurnerContext } from '../BurnerProvider';

const POLL_INTERVAL = 1000;
const CACHE_EXPIRATION = 3000;

interface BalanceCache {
  balance: string;
  maximumSendableBalance: string;
}

interface AccountBalanceState {
  data: AccountBalanceData | null;
}

const balanceCache: { [key: string]: BalanceCache & { timestamp: number } } = {};
const getCache = (key: string) => balanceCache[key] && (Date.now() - balanceCache[key].timestamp < CACHE_EXPIRATION)
  ? balanceCache[key]
  : null;
const setCache = (key: string, val: BalanceCache) => {
  balanceCache[key] = { ...val, timestamp: Date.now() };
}

class AccountBalance extends Component<AccountBalanceProps & BurnerContext, AccountBalanceState> {
  private timer: any;
  private _isMounted: boolean;

  constructor(props: BurnerContext & AccountBalanceProps) {
    super(props);
    this.state = {
      data: null,
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

    const [balance, maximumSendableBalance] = await Promise.all([
      asset.getBalance(account),
      asset.getMaximumSendableBalance(account),
    ]);
    const returnVal = { balance, maximumSendableBalance };

    setCache(cacheKey, returnVal);
    return returnVal;
  }

  async fetchData() {
    try {
      const asset = this.getAsset();
      const { balance, maximumSendableBalance } = await this.getBalance(asset);

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
        maximumSendableBalance,
        displayMaximumSendableBalance: asset.getDisplayValue(maximumSendableBalance),
        usdBalance,
      };
      this.setState({ data });
    } catch (err) {
      console.warn('[AccountBalance]', err);
    }
  }

  render() {
    return this.props.render(this.state.data);
  }
}

export default withBurner(AccountBalance);
