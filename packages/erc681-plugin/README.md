# ERC-681 Plugin for Burner Wallet

Allows scanning QR codes containing [ERC-681 transaction request transactions](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-681.md)

## Usage

Install package:

```
yarn add @burner-wallet/erc681-plugin
```

Add plugin to Burner Wallet

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { xdai, dai, eth } from '@burner-wallet/assets';
import BurnerCore from '@burner-wallet/core';
import { InjectedSigner, LocalSigner } from '@burner-wallet/core/signers';
import { InfuraGateway, InjectedGateway, XDaiGateway } from '@burner-wallet/core/gateways';
import ModernUI from '@burner-wallet/modern-ui';
import ERC681Plugin from '@burner-wallet/erc681-plugin';

const core = new BurnerCore({
  signers: [new InjectedSigner(), new LocalSigner()],
  gateways: [
    new InjectedGateway(),
    new InfuraGateway(process.env.REACT_APP_INFURA_KEY),
    new XDaiGateway(),
  ],
  assets: [xdai, dai, eth],
});


const BurnerWallet = () =>
  <ModernUI
    core={core}
    plugins={[new ERC681Plugin()]}
  />

ReactDOM.render(<BurnerWallet />, document.getElementById('root'));

```
