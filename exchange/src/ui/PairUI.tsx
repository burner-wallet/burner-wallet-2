import React, { Component, Fragment } from 'react';
import { Asset } from '@burner-wallet/assets';
import Pair from '../pairs/Pair';
const classes = require('./PairUI.module.css');

interface PairUIProps {
  pair: Pair,
  account: string,
  assets: Asset[],
}

interface PairUIState {
  mode: string,
  amount: string,
  loading: boolean,
}

export default class PairUI extends Component<PairUIProps, PairUIState> {
  private assetA: Asset;
  private assetB: Asset;

  constructor(props: PairUIProps) {
    super(props);
    this.state = {
      mode: 'default',
      amount: '0',
      loading: false,
    }
    this.assetA = this.getAsset(props.pair.assetA);
    this.assetB = this.getAsset(props.pair.assetB);
  }

  getAsset(id: string) {
    for (const asset of this.props.assets) {
      if (asset.id === id) {
        return asset;
      }
    }
    throw new Error(`Could not find asset ${id}`);
  }

  async exchange() {
    const { pair, account } = this.props
    const { mode, amount } = this.state;

    this.setState({ loading: true });
    try {
      const exchangeProps = { account, ether: amount };

      const response = await (
        mode === 'AtoB'
        ? pair.exchangeAtoB(exchangeProps)
        : pair.exchangeBtoA(exchangeProps)
      );

      console.log(response);
      this.setState({ mode: 'default', loading: false });
    } catch (err) {
      console.error(err);
      this.setState({ loading: false });
    }
  }

  buttons() {
    const { pair } = this.props
    return (
      <Fragment>
        <button className={classes.exchangeBtn} onClick={() => this.setState({ mode: 'AtoB' })}>
          {this.assetA.name} to {this.assetB.name}
        </button>
        <button className={classes.exchangeBtn} onClick={() => this.setState({ mode: 'BtoA' })}>
          {this.assetB.name} to {this.assetA.name}
        </button>
      </Fragment>
    );
  }

  form() {
    const { mode, amount, loading } = this.state;
    const { assetA, assetB } = this;
    return (
      <Fragment>
        <div>
          {mode === 'AtoB' ? `${assetA.name} to ${assetB.name}` : `${assetB.name} to ${assetA.name}`}
        </div>
        <input
          type="number"
          value={amount}
          onChange={e => this.setState({ amount: e.target.value })}
        />

        <button onClick={() => this.setState({ mode: 'default', amount: '0' })} disabled={loading}>
          Cancel
        </button>
        <button onClick={() => this.exchange()} disabled={loading}>
          Exchange
        </button>
      </Fragment>
    );
  }

  render() {
    return (
      <div className={classes.pair}>
        {this.state.mode === 'default' ? this.buttons() : this.form()}
      </div>
    );
  }
}
