************************
Plugin Development Guide
************************

The Burner Wallet 2 is a robust, extendable implementation of Austin
Griffith's famous Burner Wallet. A simple wallet can be built and
customized in only a single Javascript file. The wallet can be extended
using Plugins, which require only basic knowledge of React and the Web3
library.

For assistance with plugin development, feel free to contact me, David
Mihal (@dmihal on Telegram and Twitter)

What can a Burner Wallet Plugin do?
===================================

A Burner Wallet plugin can do anything that any other DApp can do! At a basic level, Burner Wallet
plugins are provided with a Web3 instance and

Getting Started
===============

Option 1: Clone the sample project
----------------------------------

The easiest way to get started is to start from the sample plugin
repository:

Zip file:
https://github.com/burner-wallet/sample-plugin/archive/master.zip

Fork the repo: https://github.com/burner-wallet/sample-plugin

1. Download the Zip file or fork the repo.
2. `cd` into the project directory, and run yarn install
3. In order to use your app on Mainnet or testnets, you'll need an Infura API key
4. Start your wallet! Run yarn start-local to run a wallet that connects to a local Ganache
   instance, or run yarn start-basic to run a wallet that connects to the Mainnet and xDai chains.
5. Navigate your browser to http://localhost:3000!

Option 2: Start from scratch

Creating a wallet with the Burner Wallet 2 does not require cloning any
repository, as all components are NPM packages. You simply create a new
react project, install the packages, and create your entry point.

1. Run create-react-app my-wallet and cd to my-wallet
2. Run `yarn add @burner-wallet/core @burner-wallet/assets @burner-wallet/modern-ui @burner-wallet/exchange`
3. Paste the following code in index.js to create a simple wallet:

.. code-block:: jsx
   import React from 'react';
   import ReactDOM from 'react-dom';
   import { xdai, dai, eth } from '@burner-wallet/assets';
   import BurnerCore from '@burner-wallet/core';
   import { InjectedSigner, LocalSigner } from '@burner-wallet/core/signers';
   import { InfuraGateway, InjectedGateway, XDaiGateway } from '@burner-wallet/core/gateways';
   import Exchange, { Uniswap, XDaiBridge } from '@burner-wallet/exchange';
   import ModernUI from '@burner-wallet/modern-ui';

   const core = new BurnerCore({
     signers: [new InjectedSigner(), new LocalSigner()],
     gateways: [
       new InjectedGateway(),
       new InfuraGateway(process.env.REACT_APP_INFURA_KEY),
       new XDaiGateway()
     ],
     assets: [xdai, dai, eth],
   });
   const exchange = new Exchange({ pairs: [xdaiBridge, uniswapDai] });

   const BurnerWallet = () => <ModernUI core={core} plugins={[exchange]} >
   ReactDOM.render(&lt;BurnerWallet /&gt;, document.getElementById('root'));

1. Add an Infura key (see Option 1)
2. Start your wallet! Run yarn start-local to run a wallet that connects
   to a local Ganache instance, or run yarn start-basic to run a wallet
   that connects to the Mainnet
3. Navigate your browser to http://localhost:3000!

Sample Plugins

There are many plugins that can be viewed for reference:

-  The `Burner Wallet 2`_ repo contains a number of general-purpose
   plugins, such as the `exchange`_, `ENS plugin`_, and `recent accounts
   plugin`_.
-  The `Burner Factory Plugins`_ repo contains some more advanced
   plugins such as the `collectables plugin`_ and `push notification
   plugin`_.

Typescript Support
------------------

The Burner Wallet 2 is natively built with Typescript, but you can write
your plugins in TypeScript or plain Javascript.

If you would like to write a plugin using Typescript, the only
dependency you need is @burner-wallet/types, which includes all the
typings you'll need.

If you want to write in plain javascript, then you don't need any
dependencies!

.. _Burner Wallet 2: https://github.com/dmihal/burner-wallet-2/tree/master/packages
.. _exchange: https://github.com/dmihal/burner-wallet-2/tree/master/packages/exchange
.. _ENS plugin: https://github.com/dmihal/burner-wallet-2/tree/master/packages/ens-plugin
.. _recent accounts plugin: https://github.com/dmihal/burner-wallet-2/tree/master/packages/recent-accounts-plugin
.. _Burner Factory Plugins: https://github.com/dmihal/burner-factory-plugins
.. _collectables plugin: https://github.com/dmihal/burner-factory-plugins/tree/master/plugins/collectable-plugin
.. _push notification plugin: https://github.com/dmihal/burner-factory-plugins/tree/master/plugins/push-notification-plugin



Plugin entry point
------------------
Plugins are created by defining a class that implements the following Plugin interface.

.. code-block:: typescript

  export interface Plugin {
    initializePlugin(context: BurnerPluginContext): void;
  }


.. code-block:: typescript

  import { Plugin, BurnerPluginContext } from '@burner-wallet/types'
  import Game from './ui/Game';

  export default class GamePlugin implements Plugin {
    initializePlugin(pluginContext: BurnerPluginContext) {
      pluginContext.addPage('/game', Game);
      pluginContext.addButton('apps', '/game', {
        'description': 'Play this fun game!',
      });
    }
  }

The ``pluginContext`` object provides access to web3 objects, so the plugin class is a good place to put custom contract interactions:

.. code-block:: typescript

  import { Plugin, BurnerPluginContext } from '@burner-wallet/types'
  import Game from './ui/Game';
  import gameAbi from './gameAbi.json';

  const GAME_ADDRESS = '0x1234456789123456789';

  export default class GamePlugin implements Plugin {
    initializePlugin(pluginContext: BurnerPluginContext) {
      pluginContext.addPage('/game', Game);
      pluginContext.addButton('apps', '/game', {
        'description': 'Play this fun game!',
      });
    }

    getContract() {
      const web3 = this.pluginContext.getWeb3('1');
      const contract = new web3.eth.Contract(gameAbi, GAME_ADDRESS);
      return contract;
    }

    async getScore(userAddress: string) {
      const contract = this.getContract();
      const score = await contract.methods.getScore(userAddress).call();
      return score;
    }
  }

Finally, import your class in your wallet entry point, and add it to the “plugins” array.

.. code-block:: typescript

  import GamePlugin from "./game-plugin/GamePlugin";

  const BurnerWallet = () =>
    <BurnerUI
      core={core}
      plugins={[new ExamplePlugin()]}
    />

