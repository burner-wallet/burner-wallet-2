import React, { Component, Fragment } from 'react';
import { Asset } from '@burner-wallet/assets';
import { PluginPageContext } from '@burner-wallet/types';
import Exchange from '../Exchange';
const classes = require('./ExchangePage.module.css');

interface ExchangePageState {
  assetA: Asset;
  assetB: Asset;
  amount: string;
  estimate: null | string;
  isExchanging: boolean;
}

export default class ExchangePage extends Component<PluginPageContext, ExchangePageState> {
  private poll: any;
  private exchange: Exchange;

  constructor(props: PluginPageContext) {
    super(props);
    this.exchange = props.plugin as Exchange;
    const [firstPair] = this.exchange.getPairs();
    this.state = {
      assetA: this.exchange.getAsset(firstPair.assetA),
      assetB: this.exchange.getAsset(firstPair.assetB),
      amount: '',
      estimate: null,
      isExchanging: false,
    };
  }

  getPair(assetA: Asset, assetB: Asset) {
    const [pair] = this.exchange.getPairs().filter(_pair =>
      (_pair.assetA === assetA.id && _pair.assetB === assetB.id)
      || (_pair.assetA === assetB.id && _pair.assetB === assetA.id));
    return pair;
  }

  async runExchange() {
    const { assetA, assetB, amount } = this.state;

    const pair = this.getPair(assetA, assetB);
    if (!pair) {
      throw new Error('Invalid pair');
    }

    const exchangeProps = { account: this.props.defaultAccount, ether: amount };

    this.setState({ isExchanging: true });
    try {
      const response = await (pair.assetA === assetA.id
        ? pair.exchangeAtoB(exchangeProps)
        : pair.exchangeBtoA(exchangeProps));
    } catch (e) {
      console.error(e);
    }
    this.setState({ isExchanging: false });
  }

  async getEstimate(assetA: Asset, assetB: Asset, amount: string) {
    const pair = this.getPair(assetA, assetB);
    if (!pair) {
      throw new Error('Invalid pair');
    }

    try {
      const estimate = await (pair.assetA === assetA.id
        ? pair.estimateAtoB({ ether: amount })
        : pair.estimateBtoA({ ether: amount }));
      return estimate;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  getPairOptions(asset: Asset) {
    const pairs = this.exchange.getPairs();

    const options = [];
    for (const pair of pairs) {
      if (pair.assetA === asset.id) {
        options.push(this.exchange.getAsset(pair.assetB));
      }
      if (pair.assetB === asset.id) {
        options.push(this.exchange.getAsset(pair.assetA));
      }
    }
    return options;
  }

  async update({ assetA, assetB, amount }: { assetA?: Asset; assetB?: Asset; amount?: string }) {
    const update: Partial<ExchangePageState> = { estimate: null };
    if (assetA) {
      update.assetA = assetA;

      const options = this.getPairOptions(assetA);
      if (options.length > 0 && options.indexOf(this.state.assetB) === -1) {
        update.assetB = options[0];
      }
    }
    if (assetB) {
      update.assetB = assetB;
    }
    if (amount !== undefined) {
      update.amount = amount;
    }

    this.setState(update as ExchangePageState);
    const start = { ...this.state, ...update };
    if (!start.amount) {
      return;
    }

    const estimate = await this.getEstimate(start.assetA, start.assetB, start.amount);

    // Check if anything has changed while the estimate was fetching.
    if (this.state.assetA === start.assetA
      && this.state.assetB === start.assetB
      && this.state.amount === start.amount) {
        this.setState({ estimate });
    }
  }

  render() {
    const { burnerComponents } = this.props;
    const { assetA, assetB, amount, estimate, isExchanging } = this.state;
    const { Page, AssetSelector, Button, AmountInput } = burnerComponents;

    const assetBOptions = this.getPairOptions(assetA);
    const assetsProps = { assets: assetBOptions };

    return (
      <Page title="Exchange">
        <div className={classes.fromContainer}>
          <div>From:</div>
          <AssetSelector
            selected={assetA}
            onChange={(newAsset: Asset) => this.update({ assetA: newAsset })}
            disabled={isExchanging}
          />

          <AmountInput
            asset={assetA}
            value={amount}
            onChange={newVal => this.update({ amount: newVal })}
            disabled={isExchanging}
          />
        </div>

        {assetBOptions.length > 0 ? (
          <Fragment>
            <div>To:</div>
            <AssetSelector
              selected={assetB}
              onChange={(newAsset: Asset) => this.update({ assetB: newAsset })}
              disabled={isExchanging}
              {...assetsProps}
            />
          </Fragment>
        ) : (
          <div>No exchanges available for {assetA.name}</div>
        )}

        {estimate && (
          <div>
            {assetB.getDisplayValue(estimate)} {assetB.name}
          </div>
        )}

        <Button
          onClick={() => this.runExchange()}
          disabled={isExchanging || assetBOptions.length === 0}
        >
          Exchange
        </Button>
      </Page>
    );
  }
}
