import React, { Component } from 'react';
import { withBurner, BurnerContext } from '../BurnerProvider';

const POLL_INTERVAL = 1000;

interface AccountBalanceProps {
  asset: string,
  account: string,
  render: (err: Error, data: AccountBalanceData | null) => React.ReactNode,
}

export interface AccountBalanceData {
  balance: string,
  displayBalance: string,
  usdBalance: string | null,
}

class AccountBalance extends Component<BurnerContext & AccountBalanceProps, any> {
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

  async fetchData() {
    try {
      const assetList = this.props.assets.filter(asset => asset.id == this.props.asset);
      if (assetList.length == 0) {
        throw new Error(`Unable to find asset ${this.props.asset}`);
      }
      const asset = assetList[0];

      const balance = await asset.getBalance(this.props.account);

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
