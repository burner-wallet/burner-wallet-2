import { Plugin } from '@burner-wallet/types';
import HubBridge from './HubBridge';

export default class BurnerConnectPlugin implements Plugin {
  private hubUrl: string;
  private name: string;

  constructor(name: string, hubUrl = 'https://burnerconnect.xyz/') {
    this.hubUrl = hubUrl;
    this.name = name;
  }

  initializePlugin() {
    const hub = new HubBridge(this.hubUrl);
    hub.registerWallet(this.name);
  }
}
