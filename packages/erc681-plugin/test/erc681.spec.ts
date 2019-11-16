import { expect } from 'chai';
import 'mocha';
import { eth, dai, xdai, Asset } from '@burner-wallet/assets';
import { SendData, BurnerPluginContext } from '@burner-wallet/types';
import ERC681Plugin from '../src/ERC681Plugin';

describe('ERC681Plugin', () => {
  let assets: Asset[];

  before(() => {
    assets = [eth, dai, xdai];
  });

  after(() => assets.forEach((asset: Asset) => asset.stop()));

  it('should handle send URIs', (done) => {
    const plugin = new ERC681Plugin();

    const ctx = { actions: { send: (params: SendData) => {} } };

    const pluginContext = {
      getAssets: () => assets,
      onQRScanned: (cb: any) => {
        expect(cb('abc', ctx)).to.be.false;
        expect(cb('ethereum:')).to.be.false;

        ctx.actions.send = ({ to, value, asset }: SendData) => {
          expect(to).to.equal('0x6A1517622feB74A242e68a26F423aE38E020a0b1');
          expect(value).to.equal('4787230000000000940');
          expect(asset).to.equal('eth');
        };
        expect(cb('ethereum:0x6A1517622feB74A242e68a26F423aE38E020a0b1?value=4787230000000000940', ctx)).to.be.true;

        ctx.actions.send = ({ to, value, asset }: SendData) => {
          expect(to).to.equal('0x8e23ee67d1332ad560396262c48ffbb01f93d052');
          expect(value).to.equal('1000');
          expect(asset).to.equal('dai');
          done();
        };
        expect(cb('ethereum:0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359/transfer?address=0x8e23ee67d1332ad560396262c48ffbb01f93d052&uint256=1000', ctx)).to.be.true;
      },
    } as BurnerPluginContext;

    plugin.initializePlugin(pluginContext);
  });

  it('should handle URIs with only an address');
});
