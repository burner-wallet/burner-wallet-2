# Recent Accounts for Burner Wallet

This will save accounts that the user has recently sent to, and suggest them on subsequent sends.

## Usage

Install package:

```
yarn add @burner-wallet/recent-accounts-plugin
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
import RecentAccountsPlugin from '@burner-wallet/recent-accounts-plugin';

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
    plugins={[new RecentAccountsPlugin()]}
  />

ReactDOM.render(<BurnerWallet />, document.getElementById('root'));

```
