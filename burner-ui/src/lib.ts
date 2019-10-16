import utils from 'ethereumjs-util';
import { Asset } from '@burner-wallet/assets';

export const pkToAddress = (pk: string) => utils.bufferToHex(utils.privateToAddress(utils.toBuffer(pk)));

export const pkRegex = /^0x[0-9a-f]{64}$/i;

export const isAllZero = (arr: string[]) => arr.filter(val => val !== '0').length === 0;

export const randomHex = (length: number) => {
  let result = '';
  while (result.length < length) {
    result += Math.random().toString(16).substr(2);
  }
  return '0x' + result.substr(0, length);
}
