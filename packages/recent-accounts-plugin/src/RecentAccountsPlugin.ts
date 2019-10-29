import { BurnerPluginContext, Plugin, Account, SendData } from '@burner-wallet/types';

const STORAGE_KEY = 'burner-recent-accounts';

export default class LinksPlugin implements Plugin {
  private addresses: string[];

  constructor() {
    this.addresses = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  }

  initializePlugin(pluginContext: BurnerPluginContext) {
    pluginContext.onAccountSearch((search: string) => {
      const searchLowerCase = search.toLowerCase();
      const accounts = this.addresses
        .filter((address: string) => address.indexOf(searchLowerCase) === 0)
        .map((address: string): Account => ({ address, name: 'Recently sent' }));
      return Promise.resolve(accounts);
    });

    pluginContext.onSent((data: SendData) => {
      if (!this.hasAddress(data.to)) {
        this.addAddress(data.to);
      }
    });
  }

  hasAddress(address: string) {
    return this.addresses.indexOf(address.toLowerCase()) !== -1;
  }

  addAddress(address: string) {
    this.addresses.push(address.toLowerCase());
    this.save();
  }

  save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.addresses));
  }
}
