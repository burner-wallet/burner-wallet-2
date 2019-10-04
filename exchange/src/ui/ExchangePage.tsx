import React, { Component, Fragment } from 'react';
import { Asset } from '@burner-wallet/assets';
import { PluginPageContext } from '@burner-wallet/ui';
import Exchange from '../Exchange';
import Pair from '../pairs/Pair';
const classes = require('./ExchangePage.module.css');

interface ExchangePageState {
  assetA: Asset,
  assetB: Asset,
  amount: string,
  isExchanging: boolean,
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
      isExchanging: false,
    };
  }

  async runExchange() {
    const { assetA, assetB, amount } = this.state;
    const [account] = this.props.accounts;

    const [pair] = this.exchange.getPairs().filter(_pair =>
      (_pair.assetA === assetA.id && _pair.assetB === assetB.id)
      || (_pair.assetA === assetB.id && _pair.assetB === assetA.id));
    if (!pair) {
      throw new Error('Invalid pair');
    }

    const exchangeProps = { account, ether: amount };

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

  render() {
    const { burnerComponents, assets, accounts } = this.props;
    const { assetA, assetB, amount, isExchanging } = this.state;
    const { Page, AssetSelector, Button, AmountInput } = burnerComponents;

    if (accounts.length === 0) {
      return null;
    }
    const [account] = accounts;

    const assetBOptions = this.getPairOptions(assetA);
    const assetsProps = { assets: assetBOptions };

    return (
      <Page title="Exchange">
        <div className={classes.fromContainer}>
          <div>From:</div>
          <AssetSelector
            selected={assetA}
            onChange={(newAsset: Asset) => {
              this.setState({ assetA: newAsset });
              const options = this.getPairOptions(newAsset);
              if (options.length > 0 && options.indexOf(assetB) === -1) {
                this.setState({ assetB: options[0] });
              }
            }}
            disabled={isExchanging}
          />

          <AmountInput
            asset={assetA}
            value={amount}
            onChange={newVal => this.setState({ amount: newVal })}
            disabled={isExchanging}
          />
        </div>

        {assetBOptions.length > 0 ? (
          <Fragment>
            <div>To:</div>
            <AssetSelector
              selected={assetB}
              onChange={(newAsset: Asset) => this.setState({ assetB: newAsset })}
              disabled={isExchanging}
              {...assetsProps}
            />
          </Fragment>
        ) : (
          <div>No exchanges available for {assetA.name}</div>
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
