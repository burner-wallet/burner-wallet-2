===============
Getting started
===============

#### Simple, customized wallet

Do you want to customize your own version of the wallet? Check out the simple application in the `basic-wallet` directory.

Alternatively, visit https://burnerfactory.com to create your own wallet without writing any code!

Setting Infura key
==================

By default, `basic-wallet` uses the InfuraGateway for connecting to commonly used Ethereum chains.

The entry point takes an Infura key from the `REACT_APP_INFURA_KEY` environment variable. For your wallet to
function correctly, you must create a file named `.env` in the `basic-wallet` folder with the following value:

.. code-block:: javascript

    REACT_APP_INFURA_KEY=<your infura key>


You can generate an Infura key at https://infura.io/

Add a custom token
==================

You can add any ERC20 token to your wallet by constructing a new ERC20Asset and adding it to the asset list.

The `id` parameter is the internal ID used by the wallet, while the `name` parameter is the display name
that will be displayed to the user. `network` is the chain ID of the chain the token is deployed to
(`'1'` for mainnet, `'100'` xDai, etc). `address` is the address where the token contract is deployed.

.. code-block:: javascript

    import { xdai, dai, eth, ERC20Asset } from '@burner-wallet/assets';

    const bos = new ERC20Asset({
      id: 'bos',
      name: 'Boston Token',
      network: '100',
      address: '0x52ad726d80dbb4A9D4430d03657467B99843406b',
    });

    const core = new BurnerCore({
      assets: [bos, xdai, dai, eth],
    });

Local developer wallet
======================

Are you a developer, hoping to test changes to other modules in this project (modern-ui, ui-core or various plugins)?

Run `yarn start-local` in the project root. This will start a wallet on localhost:3000 that is connected to your local
Ganache instance (connecting to node http://localhost:8545 by default).

Before the wallet server launches, a script create a pre-filled account. This account will hold 1 Ganache ETH and 100
test tokens.

Note that Metamask will override the local account, disable it or open in incognito mode for local development.