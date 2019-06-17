import { toBN } from 'web3-utils';
import { ERC20Asset } from '@burner-wallet/assets';
import Exchange from '../Exchange';
import Pair, { ExchangeParams } from './Pair';
import tokenabi from './abis/UniswapTokenPurchase.json';
import factoryabi from './abis/UniswapFactory.json';

const UNISWAP_FACTORY_ADDRESS = '0xc0a47dfe034b400b47bdad5fecda2621de6c4d95';
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
  }

  async getContract() {
    if (!this.contract) {
      const factoryContract = new this.web3.eth.Contract(factoryabi, UNISWAP_FACTORY_ADDRESS);
      const asset = this.exchange.getAsset(this.assetA) as ERC20Asset;
      const exchangeAddress = await factoryContract.methods.getExchange(asset.address).call();
      if (!exchangeAddress) {
        throw new Error(`Can not find Uniswap exchange for asset ${this.assetA}`);
      }
      console.log(`Found Uniswap for ${this.assetA} at ${exchangeAddress}`);
      this.contract = new this.web3.eth.Contract(tokenabi, exchangeAddress);
    }
    return this.contract;
  }

  async exchangeAtoB({ account, value, ether }: ExchangeParams) {
    const _value = this._getValue({ value, ether });
    const asset = this.exchange.getAsset(this.assetA) as ERC20Asset;
    const contract = await this.getContract();

    const uniswapAllowance = await asset.allowance(account, contract.address);
    if (toBN(uniswapAllowance).lt(toBN(_value))) {
      const allowanceReceipt = await asset.approve(account, contract.address, _value);
      console.log(allowanceReceipt);
    }
    return await contract.methods.tokenToEthSwapInput(_value, 1, DEADLINE)
      .send({ from: account });
  }

  async exchangeBtoA({ account, value, ether }: ExchangeParams) {
    const _value = this._getValue({ value, ether });
    const contract = await this.getContract();

    return contract.methods.ethToTokenSwapInput(1, DEADLINE)
      .send({ from: account, value: _value });
  }
}
