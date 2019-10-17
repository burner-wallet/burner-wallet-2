import { BurnerPluginContext, Plugin, Account } from '@burner-wallet/ui';
import ENS from './ENS';

export default class ENSPlugin implements Plugin {
  private ensCache: { [address: string]: string | null };
  private ens: ENS | null;

  constructor() {
    this.ensCache = {};
    this.ens = null;
  }

  initializePlugin(pluginContext: BurnerPluginContext) {
    this.ens = new ENS(pluginContext.getWeb3('1'));

    pluginContext.onAccountSearch((search: string) =>
      search.length > 3 && search.indexOf('.') !== -1 ? this.ensSearch(search) : Promise.resolve([]));
  }

  async ensSearch(search: string) {
    const cached = this.ensCache[search]
    if (cached !== undefined) {
      return cached ? [{ name: search, address: cached }] : [];
    }

    if (!this.ens) {
      return [];
    }

    const address = await this.ens.getAddress(search);
    this.ensCache[search] = address;
    return address ? [{ name: search, address }] : [];
  }
}
