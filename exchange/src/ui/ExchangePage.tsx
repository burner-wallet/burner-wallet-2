import React, { Component, Fragment } from 'react';
import Balance from './Balance';
import PairUI from './PairUI';

class ExchangePage extends Component {
  constructor(props) {
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

    const updateBalance = async asset => {
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
    const { exchange, burnerComponents, assets, accounts } = this.props;
    const { balances } = this.state;
    const { Page } = burnerComponents;

    const pairs = exchange.getPairs();

    if (accounts.length === 0) {
      return null;
    }
    const [account] = accounts;

    const getBalance = assetId => (
      <Balance
        assetId={assetId}
        assets={assets}
        account={account}
        balances={balances}
      />
    )

    let lastAsset = null;
    return (
      <Page title="Exchange">
        {pairs.map((pair, i) => {
          const response = (
            <Fragment key={i}>
              {pair.assetA !== lastAsset && getBalance(pair.assetA)}

              <PairUI pair={pair} assets={assets} />

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

const getPage = exchange => props => <ExchangePage exchange={exchange} {...props} />;

export default getPage;
