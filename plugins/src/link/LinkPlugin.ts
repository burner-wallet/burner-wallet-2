import { Asset, ERC20Asset } from '@burner-wallet/assets';
import { BurnerPluginContext, Plugin } from '@burner-wallet/ui';
import SendLinkPage from './ui/SendLinkPage';
import linkAbi from './abis/Links.json';

const LINK_XDAI_CONTRACT_ADDRESS = '0x9971B0E163795c49cAF5DefF06C271fCd8f3Ebe9';

const getClaimUrl = (claimId, claimKey) => `${window.location.origin}/claim/${claimId}/${claimKey}`;

export default class LinksPlugin implements Plugin {
  private _pluginContext: BurnerPluginContext | null;
  private contract: any;

  constructor() {
    this._pluginContext = null;
  }

  async initializePlugin(pluginContext: BurnerPluginContext) {
    this._pluginContext = pluginContext;

    await pluginContext.addPage('/link', SendLinkPage);
    await pluginContext.addHomeButton('Link', '/link');
  }

  get pluginContext() {
    if (!this._pluginContext) {
      throw new Error('Exchange not initialized');
    }
    return this._pluginContext;
  }

  getContract() {
    if (this.contract) {
      return this.contract;
    }
    const web3 = this.pluginContext.getWeb3('100');
    this.contract = new web3.eth.Contract(linkAbi, LINK_XDAI_CONTRACT_ADDRESS);
    return this.contract;
  }

  async send(fromAddress: string, asset: Asset, ether: string) {
    const web3 = this.pluginContext.getWeb3('100');
    const linkContract = this.getContract();

    const randomHash = web3.utils.sha3(Math.random().toString());
    const randomWallet = web3.eth.accounts.create();
    console.log(randomHash, randomWallet);
    const sig = web3.eth.accounts.sign(randomHash, randomWallet.privateKey);
    const expirationTime = 365; // Hard-coded to 1 year link expiration.
    const wei = web3.utils.toWei(ether, 'ether');

    let tokenAddress = ZERO_ADDRESS;
    let value = wei;

    if ((asset as ERC20Asset).address) {
      tokenAddress = (asset as ERC20Asset).address;
      value = '0';
      const approvalReceipt = await (asset as ERC20Asset).approve(fromAddress, LINK_XDAI_CONTRACT_ADDRESS, wei);
    }

    const receipt = await linkContract.methods
      .send(randomHash, sig.signature, tokenAddress, wei, expirationTime)
      .send({ value: wei, from: fromAddress });

    const claimUrl = getClaimUrl(randomHash, randomWallet.privateKey);
    return { claimUrl, receipt };
  }
}
