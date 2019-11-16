import { expect } from 'chai';
import 'mocha';
import { BurnerPluginContext } from '@burner-wallet/types';
import LegacyPlugin from '../src/LegacyPlugin';

describe('LegacyPlugin', () => {

  it('should handle xdai.io paper wallets', (done) => {
    const plugin = new LegacyPlugin();

    const ctx = {
      actions: {
        safeSetPK(newPK: string) {
          expect(newPK).to.equal('0x400204924dbd031b21711e5950dbabcef8986dff427f7f451c7ea931807a0703');
          done();
        }
      },
    };
    const pluginContext = {
      addPage: () => null,
      onQRScanned: (cb: any) => {
        expect(cb('https://xdai.io/pk#0x400204924dbd031b21711e5950dbabcef8986dff427f7f451c7ea931807a0703', ctx)).to.be.true;
      },
    } as unknown as BurnerPluginContext;

    plugin.initializePlugin(pluginContext);
  });

  it('should handle compressed xdai.io paper wallets', (done) => {
    const plugin = new LegacyPlugin();

    const ctx = {
      actions: {
        safeSetPK(newPK: string) {
          expect(newPK).to.equal('0x400204924dbd031b21711e5950dbabcef8986dff427f7f451c7ea931807a0703');
          done();
        }
      },
    };
    const pluginContext = {
      addPage: () => null,
      onQRScanned: (cb: any) => {
        expect(cb('https://xdai.io/pk#QAIEkk29AxshcR5ZUNurzviYbf9Cf39FHH6pMYB6BwM', ctx)).to.be.true;
      },
    } as unknown as BurnerPluginContext;

    plugin.initializePlugin(pluginContext);
  });
});
