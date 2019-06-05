class Pair {
  constructor({ assetA, assetB }) {
    this.assetA = assetA;
    this.assetB = assetB;
  }

  setExchange(exchange) {
    this.exchange = exchange;
  }

  exchangeAtoB({ account, value, ether }) {
    throw new Error('Not implemented');
  }

  exchangeBtoA({ account, value, ether }) {
    throw new Error('Not implemented');
  }
}

module.exports = Pair;
