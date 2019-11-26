# Legacy Plugin for Burner Wallet

This plugin allows scanning paper wallets and other QR codes generated for the original xdai.io Burner Wallet

## Usage

Install package:

```
yarn add @burner-wallet/legacy-plugin
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
import LegacyPlugin from '@burner-wallet/legacy-plugin';

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
    plugins={[new LegacyPlugin()]}
  />

ReactDOM.render(<BurnerWallet />, document.getElementById('root'));

```
