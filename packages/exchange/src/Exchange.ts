import { Asset, BurnerPluginContext, Plugin } from '@burner-wallet/types';
import Pair from './pairs/Pair';
import ExchangePage from './ui/ExchangePage';

interface ExchangeConstructor {
  pairs: Pair[];
};

export default class Exchange implements Plugin {
  private _pluginContext: BurnerPluginContext | null;
  private pairs: Pair[];

  constructor(props: ExchangeConstructor | Pair[]) {
    this.pairs = Array.isArray(props) ? (props as Pair[]) : (props as ExchangeConstructor).pairs;
    this._pluginContext = null;
  }

  initializePlugin(pluginContext: BurnerPluginContext) {
    this._pluginContext = pluginContext;

    this.pairs.forEach(pair => pair.setExchange(this));

    pluginContext.addPage('/exchange', ExchangePage);
    pluginContext.addButton('apps', 'Exchange', '/exchange', { description: 'Convert between different currencies' });
  }

  getPairs() {
    return this.pairs;
  }

  getAsset(id: string): Asset {
    for (const asset of this.pluginContext.getAssets()) {
      if (asset.id === id) {
        return asset;
      }
    }
    throw new Error(`Can not find asset ${id}`);
  }

  getWeb3(network: string) {
    return this.pluginContext.getWeb3(network);
  }

  get pluginContext() {
    if (!this._pluginContext) {
      throw new Error('Exchange not initialized');
    }
    return this._pluginContext;
  }
}
