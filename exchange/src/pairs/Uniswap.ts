const { toBN } = require('web3-utils');
const Pair = require('./Pair');
const abi = require('./abis/Uniswap.json');

const UNISWAP_ADDRESS = '0x09cabEC1eAd1c0Ba254B09efb3EE13841712bE14';
const UNISWAP_NETWORK = '1';

const DEADLINE = 1742680400;

export default class Uniswap extends Pair {
  constructor(asset) {
    super({ assetA: asset, assetB: 'eth' });
    this.contract = null;
  }

  setExchange(exchange) {
    this.exchange = exchange;
    this.web3 = exchange.getWeb3(UNISWAP_NETWORK);
    this.contract = new this.web3.eth.Contract(abi, UNISWAP_ADDRESS);
  }

  async exchangeAtoB({ account, value, ether }) {
    const _value = this._getValue({ value, ether });
    const asset = this.exchange.getAsset(this.assetA);
    const uniswapAllowance = await asset.allowance(account, UNISWAP_ADDRESS);
    if (toBN(uniswapAllowance).lt(toBN(_value))) {
      const allowanceReceipt = await asset.approve(account, UNISWAP_ADDRESS, _value);
      console.log(allowanceReceipt);
    }
    return await this.contract.methods.tokenToEthSwapInput(_value, 1, DEADLINE).send({ from: account });
  }

  exchangeBtoA({ account, value, ether }) {
    const _value = this._getValue({ value, ether });
    return this.contract.methods.ethToTokenSwapInput(1, DEADLINE).send({ from: account, value: _value });
  }

  _getValue({ value, ether }) {
    if (!value && !ether) {
      throw new Error('Must provide value for transfer');
    }
    if (value) {
      return value;
    }
    return this.web3.utils.toWei(ether, 'ether');
  }
}
