import React, { Component } from 'react';

interface BalanceProps {
  account: string,
  assets: any[],
}

export default class Balances extends Component<BalanceProps, any> {
  constructor(props: BalanceProps) {
    super(props);
    this.state = {
      balances: {},
    };
  }

  componentDidMount() {
    this.updateBalances();
  }

  componentDidUpdate(prevProps: BalanceProps) {
    if (prevProps !== this.props) {
      this.updateBalances();
    }
  }

  updateBalances() {
    const { account } = this.props;
    this.props.assets.forEach(async asset => {
      try {
        const balance = await asset.getBalance(account);
        if (account === this.props.account) {
          const balances = { ...this.state.balances, [asset.id]: balance };
          this.setState({ balances });
        }
      } catch (e) {
        console.error(e);
      }
    });
  }

  render() {
    return (
      <ul>
        {this.props.assets.map(asset =>
          <li key={asset.id}>{asset.name}: {this.state.balances[asset.id]}</li>
        )}
      </ul>
    );
  }
}
