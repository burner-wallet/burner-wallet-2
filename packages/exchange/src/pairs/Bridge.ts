import Pair, { EstimateReturn, ExchangeParams, ValueTypes } from './Pair';

interface BridgePairConstructor {
    assetA: string;
    assetABridge: string;
    assetB: string;
    assetBBridge: string;
}

export default class Bridge extends Pair {
    protected readonly assetABridge: string;
    protected readonly assetBBridge: string;

    constructor({ assetA, assetABridge, assetB, assetBBridge }: BridgePairConstructor) {
        super({ assetA, assetB });
        this.assetABridge = assetABridge;
        this.assetBBridge = assetBBridge;
    }

    async exchangeAtoB({ account, value, ether }: ExchangeParams) {
        const _value = this._getValue({ value, ether });
        const asset = this.getExchange().getAsset(this.assetA);
        const result = await asset.send({from: account, value: _value, to: this.assetABridge});
        await this.detectExchangeAToBFinished(account, _value, result);
        return result;
    }

    async exchangeBtoA({ account, value, ether }: ExchangeParams) {
        const _value = this._getValue({ value, ether });
        const asset = this.getExchange().getAsset(this.assetB);
        const result = await asset.send({from: account, value: _value, to: this.assetBBridge});
        await this.detectExchangeBToAFinished(account, _value, result);
        return result;
    }

    async estimateAtoB(value: ValueTypes): Promise<EstimateReturn> {
        return {
            estimate: this._getValue(value),
            estimateInfo: null
        };
    }

    async estimateBtoA(value: ValueTypes): Promise<EstimateReturn> {
        return {
            estimate: this._getValue(value),
            estimateInfo: null
        };
    }

    getLoadingMessage(): string {
        return 'Exchanging assets.. please wait until the bridge relays the transaction';
    }

    async detectExchangeBToAFinished(account: string, value: string, sendResult: any): Promise<any> {
        throw new Error('detect exchange B to A finished not implemented');
    }

    async detectExchangeAToBFinished(account: string, value: string, sendResult: any): Promise<any> {
        throw new Error('detect exchange A to B finished not implemented');
    }
}
