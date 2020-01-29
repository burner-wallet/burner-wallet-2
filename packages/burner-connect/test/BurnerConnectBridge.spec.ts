import { expect } from 'chai';
import 'mocha';
import { eth, dai, xdai } from '@burner-wallet/assets';
import BurnerConnectBridge from '../src/BurnerConnectBridge';

describe('BurnerConnectBridge', () => {
  it('Should send a list of assets', (done: any) => {
    let callback: any;
    // @ts-ignore
    global.window = {
      addEventListener: (event: string, _callback: any) => {
        callback = _callback;
      },
    };

    const core: any = {
      getAssets: () => [eth, dai, xdai],
      onAccountChange: () => null,
    };
    new BurnerConnectBridge(core);

    callback({
      data: { id: 0, command: 'getAssets' },
      origin: 'testorigin',
      source: {
        postMessage: (data: any, origin: string) => {
          console.log(data.response);
          expect(origin).to.equal('testorigin');
          expect(data.id).to.equal(0);

          expect(data.response.length).to.equal(3);

          expect(data.response[0].id).to.equal('eth');
          expect(data.response[1].id).to.equal('dai');
          expect(data.response[2].id).to.equal('xdai');

          done();
        },
      },
    });
  });
});
