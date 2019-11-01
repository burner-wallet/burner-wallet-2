import Web3 from 'web3';
import Exchange from '../Exchange';

export interface ValueTypes {
  value?: string;
  ether?: string;
}

export interface ExchangeParams extends ValueTypes {
  account: string;
}

interface PairConstructor {
  assetA: string;
  assetB: string;
}

export default abstract class Pair {
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

  abstract exchangeAtoB({ account, value, ether }: ExchangeParams): Promise<void>;
  abstract exchangeBtoA({ account, value, ether }: ExchangeParams): Promise<void>;

  abstract estimateAtoB(value: ValueTypes): Promise<string>;
  abstract estimateBtoA(value: ValueTypes): Promise<string>;

  set exchange(newExchange: Exchange) {
    this._exchange = newExchange;
  }

  get exchange(): Exchange {
    if (!this._exchange) {
      throw new Error('Exchange not set');
    }
    return this._exchange;
  }

  _getValue({ value, ether }: ValueTypes) {
    if (!value && !ether) {
      throw new Error('Must provide value for transfer');
    }
    if (value) {
      return value;
    }
    const web3 = this.exchange.getWeb3(this.exchange.getAsset(this.assetA).network);
    return web3.utils.toWei(ether as string, 'ether');
  }
}
