import { toBN } from 'web3-utils';
import { ERC20Asset } from '@burner-wallet/assets';
import Exchange from '../Exchange';
import Pair, { ExchangeParams } from './Pair';
import abi from './abis/Uniswap.json';

const UNISWAP_ADDRESS = '0x09cabEC1eAd1c0Ba254B09efb3EE13841712bE14';
const UNISWAP_NETWORK = '1';

const DEADLINE = 1742680400;

export default class Uniswap extends Pair {
  private web3: any;
  private contract: any;

  constructor(asset: string) {
    super({ assetA: asset, assetB: 'eth' });
    this.contract = null;
  }

  setExchange(exchange: Exchange) {
    this.exchange = exchange;
    this.web3 = exchange.getWeb3(UNISWAP_NETWORK);
    this.contract = new this.web3.eth.Contract(abi, UNISWAP_ADDRESS);
  }

  async exchangeAtoB({ account, value, ether }: ExchangeParams) {
    const _value = this._getValue({ value, ether });
    const asset = this.exchange.getAsset(this.assetA) as ERC20Asset;
    const uniswapAllowance = await asset.allowance(account, UNISWAP_ADDRESS);
    if (toBN(uniswapAllowance).lt(toBN(_value))) {
      const allowanceReceipt = await asset.approve(account, UNISWAP_ADDRESS, _value);
      console.log(allowanceReceipt);
    }
    return await this.contract.methods.tokenToEthSwapInput(_value, 1, DEADLINE).send({ from: account });
  }

  exchangeBtoA({ account, value, ether }: ExchangeParams) {
    const _value = this._getValue({ value, ether });
    return this.contract.methods.ethToTokenSwapInput(1, DEADLINE).send({ from: account, value: _value });
  }
}
