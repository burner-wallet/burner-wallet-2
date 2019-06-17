import { Asset } from '@burner-wallet/assets';
import { toWei } from 'web3-utils';
import Exchange from '../Exchange';

export interface ExchangeParams {
  account: string,
  value?: string,
  ether?: string,
}

interface PairConstructor {
  assetA: string,
  assetB: string,
}

export default class Pair {
  public assetA: string;
  public assetB: string;
  private _exchange: Exchange | null;

  constructor({ assetA, assetB }: PairConstructor) {
    this.assetA = assetA;
    this.assetB = assetB;
    this._exchange = null;
  }

  setExchange(exchange: Exchange) {
    this._exchange = exchange;
  }

  exchangeAtoB({ account, value, ether }: ExchangeParams) {
    throw new Error('Not implemented');
  }

  exchangeBtoA({ account, value, ether }: ExchangeParams) {
    throw new Error('Not implemented');
  }

  set exchange(newExchange: Exchange) {
    this._exchange = newExchange;
  }

  get exchange(): Exchange {
    if (!this._exchange) {
      throw new Error('Exchange not set');
    }
    return this._exchange;
  }

  _getValue({ value, ether }: { value?: string, ether?: string }) {
    if (!value && !ether) {
      throw new Error('Must provide value for transfer');
    }
    if (value) {
      return value;
    }
    return toWei(ether as string, 'ether');
  }
}
