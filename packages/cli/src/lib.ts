import axios from 'axios';

let id = 0;
const rpc = (url: string, method: string, ...params: any[]) =>
  axios.post(url, { jsonrpc: "2.0", id: id++, method, params }).then(response => response.data.result);

export const testRPC = (url: string) => async () => {
  try {
    const response = await rpc(url, 'eth_blockNumber');
    return !!response;
  } catch (e) {
    return false;
  }
};
