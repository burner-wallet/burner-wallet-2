import React, { Component } from 'react';
import PairUI from './PairUI';

class ExchangePage extends Component {
  render() {
    const { exchange, burnerComponents, assets } = this.props
    const { Page } = burnerComponents;
    const pairs = exchange.getPairs();
    return (
      <Page title="Exchange">
        {pairs.map((pair, i) => <PairUI pair={pair} assets={assets} key={i}/>)}
      </Page>
    );
  }
}

const getPage = exchange => props => <ExchangePage exchange={exchange} {...props} />;

export default getPage;
