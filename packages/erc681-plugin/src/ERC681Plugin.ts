import { BurnerPluginContext, Plugin } from '@burner-wallet/ui';
import { ERC20Asset } from '@burner-wallet/assets';
import parser from './eth-parse-uri';

export default class ERC681Plugin implements Plugin {
  initializePlugin(pluginContext: BurnerPluginContext) {
    const getAsset = (network: string, address: string) => {
      const _network = network && network !== '' ? network : '1';
      const assets = pluginContext.getAssets();
      const [asset] = assets.filter(address && address !== ''
        ? asset => asset.network === _network && (asset as ERC20Asset).address === address
        : asset => asset.type === 'native' && asset.network === _network);
      return asset || null;
    }

    pluginContext.onQRScanned((qr: string, ctx: any) => {
      if (qr.indexOf('ethereum:') === 0) {
        const parsed = parser(qr);

        if (parsed.targetAddress === '') {
          return false;
        }

        const recipient = parsed.functionName !== '' ? parsed.address : parsed.targetAddress;
        const contract = parsed.functionName !== '' ? parsed.targetAddress : null;
        const asset = getAsset(parsed.chainId, contract);
        if (!asset) {
          return false;
        }

        ctx.actions.send({
          to: recipient,
          value: parsed.value || parsed.uint256,
          asset: asset.id,
        });

        return true;
      }
      return false;
    });
  }
}
