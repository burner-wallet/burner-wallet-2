import BurnerCore from '@burner-wallet/core';
import './loaderDefs';
import 'file-loader?name=burnerconnect.html!./burnerconnect.html';

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
  }

  handleMessage({ command, params, id }: BurnerConnectMessage) {
    switch (command) {
      case 'send':
        return this.send(id, params as SendMessage);
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
