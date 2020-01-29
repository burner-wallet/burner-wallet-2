import { expect } from 'chai';
import 'mocha';
import { eth, dai, xdai } from '@burner-wallet/assets';
import BurnerConnectBridge from '../src/BurnerConnectBridge';

const ACCOUNT_1 = '0x1111111111111111111111111111111111111111';
const ACCOUNT_2 = '0x0101010101010101010101010101010101010101';

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


  it('Should send event for account changes', (done: any) => {
    // @ts-ignore
    global.window = {
      addEventListener: () => null,
      parent: {
        postMessage: (message: any) => {
          expect(message.message).to.equal('accountsChanged');
          expect(message.accounts.length).to.equal(2);
          expect(message.accounts[0]).to.equal(ACCOUNT_1);
          expect(message.accounts[1]).to.equal(ACCOUNT_2);
          done();
        },
      },
    };

    const core: any = {
      changeListeners: [],
      onAccountChange(cb: any) {
        this.changeListeners.push(cb);
      },
      emitAccountChange(newAccounts: string[]) {
        this.changeListeners.forEach((listener: any) => listener(newAccounts));
      },
    };
    new BurnerConnectBridge(core);

    core.emitAccountChange([ACCOUNT_1, ACCOUNT_2]);
  });
});
