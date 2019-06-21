import React, { Component, Fragment } from 'react';
import { Asset } from '@burner-wallet/assets';
import { BurnerContext } from '@burner-wallet/ui';
import Exchange from '../Exchange';
import Pair from '../pairs/Pair';
import Balance from './Balance';
import PairUI from './PairUI';

interface ExchangePageProps extends BurnerContext {
  plugin: Exchange,
}

interface ExchangePageState {
  balances: { [index:string] : string },
}

export default class ExchangePage extends Component<ExchangePageProps, ExchangePageState> {
  private poll: any;

  constructor(props: ExchangePageProps) {
    super(props);
    this.state = {
      balances: {},
    };
    this.poll = null;
  }

  componentDidMount() {
    this.updateBalances();
    this.poll = setInterval(() => this.updateBalances(), 2500);
  }

  componentWillUnmount() {
    if (this.poll) {
      clearInterval(this.poll);
    }
  }

  updateBalances() {
    const { assets, accounts } = this.props;

    const updateBalance = async (asset: Asset) => {
      const balance = await asset.getDisplayBalance(accounts[0]);
      const balances = {
        ...this.state.balances,
        [asset.id]: balance,
      };
      this.setState({ balances });
    };

    if (accounts.length > 0) {
      assets.forEach(updateBalance);
    }
  }

  render() {
    const { plugin, burnerComponents, assets, accounts } = this.props;
    const { balances } = this.state;
    const { Page } = burnerComponents;

    const pairs = plugin.getPairs();

    if (accounts.length === 0) {
      return null;
    }
    const [account] = accounts;

    const getBalance = (assetId: string) => (
      <Balance
        assetId={assetId}
        assets={assets}
        balances={balances}
      />
    )

    let lastAsset: string;
    return (
      <Page title="Exchange">
        {pairs.map((pair: Pair, i: number) => {
          const response = (
            <Fragment key={i}>
              {pair.assetA !== lastAsset && getBalance(pair.assetA)}

              <PairUI pair={pair} assets={assets} account={account} />

              {getBalance(pair.assetB)}
            </Fragment>
          );
          lastAsset = pair.assetB;
          return response;
        })}
      </Page>
    );
  }
}
