import BurnerCore from '@burner-wallet/core';
import { Asset } from '@burner-wallet/types';
import './loaderDefs';
import 'file-loader?name=burnerconnect-bridge.html!./burnerconnect-bridge.html';
import 'file-loader?name=burnerconnect-login.html!./burnerconnect-login.html';

const serializeAsset = (asset: Asset) => ({
  id: asset.id,
  name: asset.name,
  network: asset.network,
  type: asset.type,
  icon: asset.icon,
  // @ts-ignore
  address: asset.address || null,
});

interface BurnerConnectMessage {
  id: number;
  command: string;
  params: any;
}

interface SendMessage {
  jsonrpc: string;
  network: string;
  method: string;
  params: any[];
}

if (window.opener && window.opener.origin === window.origin) {
  window.opener.postMessage({ localStorage: {...localStorage} }, window.origin);
}

const isSafari = /^((?!chrome|android).)*safari/i.test(window.navigator.userAgent);
// const startingStorageLength = window.localStorage.length;

export default class BunerConnectBridge {
  private core: BurnerCore;

  constructor(core: BurnerCore) {
    this.core = core;

    window.addEventListener('message', async (event: MessageEvent) => {
      const response = await this.handleMessage(event.data as BurnerConnectMessage);
      console.log('got', event.data, 'responding', response);
      if (response) {
        (event.source as WindowProxy).postMessage({ response, id: event.data.id }, event.origin);
      }
    });

    core.onAccountChange((accounts: string[]) => {
      window.parent.postMessage({ message: 'accountsChanged', accounts }, '*');
    });

    if (window.parent) {
      window.parent.postMessage({ message: 'frameLoaded' }, '*');
    }
  }

  handleMessage({ command, params, id }: BurnerConnectMessage) {
    switch (command) {
      case 'send':
        return this.send(id, params as SendMessage);

      case 'getAssets':
        return this.core.getAssets().map(serializeAsset);

      case 'requiresPopup':
        return isSafari;// && startingStorageLength === 0;

      case 'popup':
        return this.awaitPopup();

      default:
        if (command) {
          console.error(`Unknown command ${command}`);
        }
    }
  }

  send(id: number, { jsonrpc, network, method, params }: SendMessage) {
    return new Promise((resolve, reject) => {
      const provider = this.core.getProvider(network);
      provider.sendAsync({ jsonrpc, id, method, params }, (err: any, result: any) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  }

  awaitPopup() {
    return new Promise((resolve) => {
      const content = document.querySelector('#content');
      content!.innerHTML = '';
      const button = document.createElement('button');
      button.innerText = 'Connect';
      content!.appendChild(button);

      button.addEventListener('click', () => {
        let popup: any = null;
        const listener = (e: any) => {
          if (e.data.localStorage) {
            console.log('Got localstorage', e.data.localStorage);
            this.batchSetLocalstorage(e.data.localStorage);    
            popup.close();
            resolve({ success: true });
            window.removeEventListener('message', listener);
          }
        };

        window.addEventListener('message', listener);

        popup = window.open(window.location.href, '_blank');
      });

      window.parent.postMessage({
        message: 'setSize',
        height: document.body.clientHeight,
      }, '*');
    });
  }

  batchSetLocalstorage(storage: any) {
    for (const key in storage) {
      window.localStorage.setItem(key, storage[key]);
    }
  }
}
