import { xdai, dai, eth } from '@burner-wallet/assets';
import BurnerCore from '@burner-wallet/core';
import { LocalSigner } from '@burner-wallet/core/signers';
import { InfuraGateway, XDaiGateway, } from '@burner-wallet/core/gateways';
import { BurnerConnectBridge } from '@burner-wallet/burner-connect-wallet';

const core = new BurnerCore({
  signers: [new LocalSigner()],
  gateways: [
    new InfuraGateway(process.env.REACT_APP_INFURA_KEY!),
    new XDaiGateway(),
  ],
  assets: [xdai, dai, eth],
});

export default new BurnerConnectBridge(core);
