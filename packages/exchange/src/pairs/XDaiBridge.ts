import Pair, { ExchangeParams, ValueTypes } from './Pair';

const toXdaiBridge = '0x4aa42145Aa6Ebf72e164C9bBC74fbD3788045016';
const toDaiBridge = '0x7301cfa0e1756b71869e93d4e4dca5c7d0eb0aa6';

export default class XDaiBridge extends Pair {
  constructor() {
    super({ assetA: 'xdai', assetB: 'dai' });
  }

  exchangeAtoB({ account, value, ether }: ExchangeParams) {
    const _value = this._getValue({ value, ether });
    const xdai = this.getExchange().getAsset('xdai');
    return xdai.send({
      from: account,
      value: _value,
      to: toDaiBridge,
    });
  }

  exchangeBtoA({ account, value, ether }: ExchangeParams) {
    const _value = this._getValue({ value, ether });

    const dai = this.getExchange().getAsset(this.assetB);
    return dai.send({
      from: account,
      value: _value,
      to: toXdaiBridge,
    });
  }

  async estimateAtoB(value: ValueTypes) {
    return this._getValue(value);
  }

  async estimateBtoA(value: ValueTypes) {
    return this._getValue(value);
  }
}
