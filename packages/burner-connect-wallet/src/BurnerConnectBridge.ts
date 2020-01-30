import BurnerCore from '@burner-wallet/core';
import { Asset } from '@burner-wallet/types';
import './loaderDefs';
import 'file-loader?name=burnerconnect.html!./burnerconnect.html';

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

export default class BunerConnectBridge {
  private core: BurnerCore;

  constructor(core: BurnerCore) {
    this.core = core;

    window.addEventListener('message', async (event: MessageEvent) => {
      const response = await this.handleMessage(event.data as BurnerConnectMessage);
      if (response) {
        (event.source as WindowProxy).postMessage({ response, id: event.data.id }, event.origin);
      }
    });

    core.onAccountChange((accounts: string[]) => {
      window.parent.postMessage({ message: 'accountsChanged', accounts }, '*');
    });
  }

  handleMessage({ command, params, id }: BurnerConnectMessage) {
    switch (command) {
      case 'send':
        return this.send(id, params as SendMessage);
      case 'getAssets':
        return this.core.getAssets().map(serializeAsset);
      default:
        console.error(`Unknown command ${command}`);
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
}
