import Web3 from 'web3';
import { ERC20Asset } from '@burner-wallet/assets';
import Exchange from '../Exchange';
import Pair, { ExchangeParams, ValueTypes } from './Pair';

const { toBN } = Web3.utils;

const UNISWAP_FACTORY_ADDRESS = '0xc0a47dfe034b400b47bdad5fecda2621de6c4d95';
const UNISWAP_NETWORK = '1';

const DEADLINE = 1742680400;

let _abis: any = null;
const getABI = async (contract: string) => {
  if (!_abis) {
    _abis = await import('./abis');
  }

  return _abis[contract];
}

export default class Uniswap extends Pair {
  private exchangeAddress: string | null;

  constructor(asset: string) {
    super({ assetA: asset, assetB: 'eth' });
    this.exchangeAddress = null;
  }

  async getContract() {
    const web3 = this.getExchange().getWeb3(UNISWAP_NETWORK);
    const exchangeAddress = await this.getExchangeAddress();
    const contract = new web3.eth.Contract(await getABI('uniswapToken'), exchangeAddress!);
    return contract;
  }

  async getExchangeAddress() {
    if (!this.exchangeAddress) {
      const web3 = this.getExchange().getWeb3(UNISWAP_NETWORK);
      const factoryContract = new web3.eth.Contract(await getABI('uniswapFactory'), UNISWAP_FACTORY_ADDRESS);
      const asset = this.getExchange().getAsset(this.assetA) as ERC20Asset;
      const exchangeAddress = await factoryContract.methods.getExchange(asset.address).call();
      if (!exchangeAddress) {
        throw new Error(`Can not find Uniswap exchange for asset ${this.assetA}`);
      }
      console.log(`Found Uniswap for ${this.assetA} at ${exchangeAddress}`);
      this.exchangeAddress = exchangeAddress;
    }
    return this.exchangeAddress;
  }

  async exchangeAtoB({ account, value, ether }: ExchangeParams) {
    const _value = this._getValue({ value, ether });
    const asset = this.getExchange().getAsset(this.assetA) as ERC20Asset;
    const contract = await this.getContract();

    const uniswapAllowance = await asset.allowance(account, this.exchangeAddress!);
    if (toBN(uniswapAllowance).lt(toBN(_value))) {
      const allowanceReceipt = await asset.approve(account, this.exchangeAddress!, _value);
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


  async estimateAtoB(value: ValueTypes) {
    const contract = await this.getContract();
    const output = await contract.methods.getTokenToEthInputPrice(this._getValue(value)).call();
    return {
      estimate: output,
      estimateInfo: null
    };
  }

  async estimateBtoA(value: ValueTypes) {
    const contract = await this.getContract();
    const output = await contract.methods.getEthToTokenInputPrice(this._getValue(value)).call();
    return {
      estimate: output,
      estimateInfo: null
    };
  }
}
