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
    const page = getPage(this);
    await pluginContext.addPage('/exchange', page);
    await pluginContext.addHomeButton('Exchange', '/exchange');
  }

  getPairs() {
    return this.pairs;
  }
}
