import Bridge from "./Bridge";

export default class XDaiBridge extends Bridge {
  constructor() {
    super({
      assetA: 'xdai',
      assetABridge: '0x7301cfa0e1756b71869e93d4e4dca5c7d0eb0aa6',
      assetB: 'dai',
      assetBBridge: '0x4aa42145Aa6Ebf72e164C9bBC74fbD3788045016'
    });
  }
}
