import { toWei } from 'web3-utils';
import Exchange from '../Exchange';

export interface ValueTypes {
  value?: string;
  ether?: string;
}

export interface ExchangeParams extends ValueTypes {
  account: string;
}

export interface EstimateReturn {
  estimate: string;
  estimateInfo?: null | string;
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

  abstract exchangeAtoB({ account, value, ether }: ExchangeParams): Promise<void>;
  abstract exchangeBtoA({ account, value, ether }: ExchangeParams): Promise<void>;

  abstract estimateAtoB(value: ValueTypes): Promise<EstimateReturn>;
  abstract estimateBtoA(value: ValueTypes): Promise<EstimateReturn>;

  setExchange(newExchange: Exchange) {
    this._exchange = newExchange;
  }

  getExchange(): Exchange {
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
    return toWei(ether as string, 'ether');
  }

  getLoadingMessage(): string {
    return 'Exchanging assets...'
  }
}
