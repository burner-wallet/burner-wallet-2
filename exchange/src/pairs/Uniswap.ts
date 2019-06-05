const Pair = require('./Pair');
const abi = require('./abis/Uniswap.json');

const UNISWAP_ADDRESS = '0x416F1Ac032D1eEE743b18296aB958743B1E61E81';
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

  exchangeAtoB({ account, value, ether }) {
    const _value = this._getValue({ value, ether });
    return contract.methods.tokenToEthSwapInput(_value, 1, DEADLINE).send({ from: account });
  }

  exchangeBtoA({ account, value, ether }) {
    const _value = this._getValue({ value, ether });
    return contract.methods.ethToTokenSwapInput(1, DEADLINE).send({ from: account, value: _value });
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
