# Burner Wallet Exchange Plugin

Allows exchanging various assets inside a Burner Wallet

## Usage

Install package:

```
yarn add @burner-wallet/exchange
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
import Exchange, { Uniswap, XDaiBridge } from '@burner-wallet/exchange';

const core = new BurnerCore({
  signers: [new InjectedSigner(), new LocalSigner()],
  gateways: [
    new InjectedGateway(),
    new InfuraGateway(process.env.REACT_APP_INFURA_KEY),
    new XDaiGateway(),
  ],
  assets: [xdai, dai, eth],
});

const exchange = new Exchange({
  pairs: [new XDaiBridge(), new Uniswap('dai')],
});


const BurnerWallet = () =>
  <ModernUI
    core={core}
    plugins={[exchange]}
  />

ReactDOM.render(<BurnerWallet />, document.getElementById('root'));

```

## API Reference

### `Exchange`
`import Exchange from '@burner-wallet/exchange';`

The main plugin module.

The constructor accepts an object with the `pairs` property containing an array of trading pairs.

```javascript
const exchange = new Exchange({ pairs: [pair1, pair2] });
```

## `XDaiBridge`
`import { XDaiBridge } from '@burner-wallet/exchange';`

The XDaiBridge class is a trading pair that allows sending Dai to the xDai sidechain, and vice-versa.

```javascript
const xdaiBridge = new XDaiBridge();
```

## `Uniswap`
`import { Uniswap } from '@burner-wallet/exchange';`

The Uniswap class is a trading pair that allows trading Ether against any ERC20 token supported by Uniswap.

The constructor takes one paramater, which is the asset ID for the token to trade. Dai has the asset ID `dai`,
all other IDs are specified in the asset constructor.

```javascript
const daiUniswap = new Uniswap('dai');

const myToken = new ERC20Asset({
  id: 'mytoken',
  type: 'ERC20',
  network: '1',
  address: '0x1234567890123456789012345678901234567890',
});
const myUniswap = new Uniswap('mytoken');
```

## `Pair`
`import { Uniswap } from '@burner-wallet/exchange';`

Pair is an abstract class that defines the interface for trading pairs. If you would like to add custom trading
functionality, you can extend this class and implement it's methods. Check Uniswap.ts and XDaiBridge.ts for
example implementations.
