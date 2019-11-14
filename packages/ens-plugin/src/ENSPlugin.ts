import { BurnerPluginContext, Plugin, Account } from '@burner-wallet/types';
import ENS from './ENS';

export default class ENSPlugin implements Plugin {
  private ensCache: { [name: string]: string | null };
  private reverseCache: { [address: string]: string | null };
  private ens: ENS | null;

  constructor() {
    this.ensCache = {};
    this.reverseCache = {};
    this.ens = null;
  }

  initializePlugin(pluginContext: BurnerPluginContext) {
    this.ens = new ENS(pluginContext.getWeb3('1'));

    pluginContext.addAddressToNameResolver((address: string) => this.lookupName(address));
    pluginContext.onAccountSearch((search: string) =>
      search.length > 3 && search.indexOf('.') !== -1 ? this.ensSearch(search) : Promise.resolve([]));
  }

  async lookupName(address: string) {
    if (this.reverseCache[address] !== undefined) {
      return this.reverseCache[address];
    }

    try {
      const name = await this.ens!.reverseLookup(address);
      this.reverseCache[address] = name;
      return name;
    } catch (e) {
      console.warn('Reverse ENS error', e);
      return null;
    }
  }

  async ensSearch(search: string) {
    const cached = this.ensCache[search]
    if (cached !== undefined) {
      return cached ? [{ name: search, address: cached }] : [];
    }

    const address = await this.ens!.getAddress(search);
    this.ensCache[search] = address;
    return address ? [{ name: search, address }] : [];
  }
}
