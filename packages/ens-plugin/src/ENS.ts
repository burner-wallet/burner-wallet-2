import namehash from 'eth-ens-namehash';
import { registryInterface, resolverInterface } from './abi';

const ZERO = '0x0000000000000000000000000000000000000000';

const registrarAddress: { [network: string]: string } = {
  '1': '0x314159265dd8dbb310642f98f50c066173c1259b',
  '3': '0x112234455c3a32fd11230c42e7bccd4a84e02010',
  '4': '0xe7410170f87102df0055eb195163a03b7f2bff4a',
  '5': '0x112234455c3a32fd11230c42e7bccd4a84e02010',
};

export default class ENS {
  private web3: any;
  private network: string;

  constructor(web3: any, network = '1') {
    this.web3 = web3;
    this.network = network;
  }

  getRegistry() {
    if (!registrarAddress[this.network]) {
      throw new Error(`ENS not supported on network ${this.network}`);
    }
    return new this.web3.eth.Contract(registryInterface, registrarAddress[this.network]!);
  }

  getResolver(address: string) {
    return new this.web3.eth.Contract(resolverInterface, address);
  }

  async getAddress(ensName: string) {
    const hashed = namehash.hash(ensName);
    const resolverAddr = await this.getRegistry().methods.resolver(hashed).call();
    if (resolverAddr === ZERO) {
      return null;
    }

    const address = await this.getResolver(resolverAddr).methods.addr(hashed).call();

    return address === ZERO ? null : address;
  }

  async reverseLookup(address: string) {
    const _address = (address.indexOf('0x') === 0 ? address.substr(2) : address).toLowerCase();
    const hashed = namehash.hash(`${_address}.addr.reverse`);

    const resolverAddr = await this.getRegistry().methods.resolver(hashed).call();
    if (resolverAddr === ZERO) {
      return null;
    }

    const name = await this.getResolver(resolverAddr).methods.name(hashed).call();

    return name;
  }
}
