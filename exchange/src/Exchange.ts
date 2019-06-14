import getPage from './ui/ExchangePage';

interface ExchangeConstructor {
  pairs: Pair[],
};

export default class Exchange {
  constructor({ pairs }: ExchangeConstructor) {
    this.pairs = pairs;
  }

  async initializePlugin(pluginContext) {
    this.pluginContext = pluginContext;

    this.pairs.forEach(pair => pair.setExchange(this));

    const page = getPage(this);
    await pluginContext.addPage('/exchange', page);
    await pluginContext.addHomeButton('Exchange', '/exchange');
  }

  getPairs() {
    return this.pairs;
  }

  getAsset(id) {
    for (const asset of this.pluginContext.getAssets()) {
      if (asset.id === id) {
        return asset;
      }
    }
    return null;
  }

  getWeb3(network) {
    return this.pluginContext.getWeb3(network);
  }
}
