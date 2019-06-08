import React, { Component } from 'react';
import classes from './PairUI.module.css';

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
      <div className={classes.pair}>
        <button className={classes.exchangeBtn}>{this.assetA.name} to {this.assetB.name}</button>
        <button className={classes.exchangeBtn}>{this.assetB.name} to {this.assetA.name}</button>
      </div>
    );
  }
}
