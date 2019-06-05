import React, { Component } from 'react';

export default class PairUI extends Component {
  constructor(props) {
    super(props);
    this.state = {
      balanceA: '0',
      balanceB: '0',
    }
    this.assetA = this.getAsset(props.pair.assetA);
    this.assetB = this.getAsset(props.pair.assetB);
  }

  getAsset(id) {
    for (const asset of this.props.assets) {
      if (asset.id === id) {
        return asset;
      }
    }
    throw new Error(`Could not find asset ${id}`);
  }

  render() {
    const { pair } = this.props
    return (
      <div>
        <div>From: {this.assetA.name}</div>
        <div>To: {this.assetB.name}</div>
      </div>
    );
  }
}
