import namehash from 'eth-ens-namehash';
import { registryInterface, resolverInterface } from './abi';

const ZERO = '0x0000000000000000000000000000000000000000';

export default class ENS {
  private web3: any;

  constructor(web3: any) {
    this.web3 = web3;
  }

  getRegistry() {
    return new this.web3.eth.Contract(registryInterface, '0x314159265dd8dbb310642f98f50c066173c1259b');
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
