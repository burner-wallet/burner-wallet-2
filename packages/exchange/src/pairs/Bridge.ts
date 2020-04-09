import Pair, { ExchangeParams, ValueTypes } from './Pair';
import { Asset } from '@burner-wallet/types';
import promiseRetry from 'promise-retry';
import Web3 from "web3";
const { toBN } = Web3.utils;


interface BridgePairConstructor {
    assetA: string;
    assetABridge: string;
    assetB: string;
    assetBBridge: string;
}

interface BridgeExchangeParams {
    asset: Asset;
    assetOnOtherNetwork: Asset;
    from: string;
    value: string;
    to: string;
}

export default class Bridge extends Pair {
    protected readonly assetABridge: string;
    protected readonly assetBBridge: string;

    constructor({ assetA, assetABridge, assetB, assetBBridge }: BridgePairConstructor) {
        super({ assetA, assetB });
        this.assetABridge = assetABridge;
        this.assetBBridge = assetBBridge;
    }

    exchangeAtoB({ account, value, ether }: ExchangeParams) {
        const _value = this._getValue({ value, ether });
        const asset = this.getExchange().getAsset(this.assetA);
        const assetOnOtherNetwork = this.getExchange().getAsset(this.assetB);
        return this._exchangeAndWait({
            asset,
            assetOnOtherNetwork,
            from: account,
            value: _value,
            to: this.assetABridge
        });
    }

    exchangeBtoA({ account, value, ether }: ExchangeParams) {
        const _value = this._getValue({ value, ether });
        const asset = this.getExchange().getAsset(this.assetB);
        const assetOnOtherNetwork = this.getExchange().getAsset(this.assetA);
        return this._exchangeAndWait({
            asset,
            assetOnOtherNetwork,
            from: account,
            value: _value,
            to: this.assetBBridge
        });
    }

    async _exchangeAndWait({ asset, assetOnOtherNetwork, from, value, to }: BridgeExchangeParams) {
        const initialBalance = await assetOnOtherNetwork.getBalance(from);
        const result = await asset.send({ from, value, to });
        await promiseRetry(async (retry) => {
            const updatedBalance = await assetOnOtherNetwork.getBalance(from);
            console.log("updated balance", updatedBalance.toString())
            if (!toBN(updatedBalance).gt(toBN(initialBalance))) {
                retry(null);
            }
        }, {
            forever: true,
            factor: 1.2
        });

        return result;
    }

    async estimateAtoB(value: ValueTypes) {
        return this._getValue(value);
    }

    async estimateBtoA(value: ValueTypes) {
        return this._getValue(value);
    }

    getLoadingMessage(): string {
        return 'Exchanging assets.. please wait until the bridge relays the transaction';
    }
}
