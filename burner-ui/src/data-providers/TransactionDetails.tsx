import React, { Component } from 'react';
import { withBurner, BurnerContext } from '../BurnerProvider';

export interface TransactionDetailsProps {
  asset: string,
  txHash: string,
  render: (tx: any) => React.ReactNode,
}

interface Transaction {
  txHash: string,
  from: string,
  to: string,
  value: string,
  displayValue: string,
}

class TransactionDetails extends Component<BurnerContext & TransactionDetailsProps, any> {
  constructor(props: BurnerContext & TransactionDetailsProps) {
    super(props);
    this.state = {
      tx: null,
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(oldProps: BurnerContext & TransactionDetailsProps) {
    if (this.props !== oldProps) {
      this.fetchData();
    }
  }

  async fetchData() {
    try {
      const assetList = this.props.assets.filter(asset => asset.id == this.props.asset);
      if (assetList.length == 0) {
        throw new Error(`Unable to find asset ${this.props.asset}`);
      }
      const asset = assetList[0];

      const tx = await asset.getTx(this.props.txHash);
      this.setState({ tx });
      setTimeout(() => this.fetchData(), 2500);
    } catch (err) {
      console.warn(err);
      setTimeout(() => this.fetchData(), 2500);
    }
  }

  render() {
    return this.props.render(this.state.tx);
  }
}

export default withBurner(TransactionDetails);
