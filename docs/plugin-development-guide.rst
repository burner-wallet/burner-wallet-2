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
plugins are provided with a Web3 instance and the ability to insert React components into the wallet
interface.

Sample Plugins
==============

There are many plugins that can be viewed for reference:

-  The `Burner Wallet 2`_ repo contains a number of general-purpose
   plugins, such as the `exchange`_, `ENS plugin`_, and `recent accounts
   plugin`_.
-  The `Burner Factory Plugins`_ repo contains some more advanced
   plugins such as the `collectables plugin`_ and `push notification
   plugin`_.

.. _Burner Wallet 2: https://github.com/dmihal/burner-wallet-2/tree/master/packages
.. _exchange: https://github.com/dmihal/burner-wallet-2/tree/master/packages/exchange
.. _ENS plugin: https://github.com/dmihal/burner-wallet-2/tree/master/packages/ens-plugin
.. _recent accounts plugin: https://github.com/dmihal/burner-wallet-2/tree/master/packages/recent-accounts-plugin
.. _Burner Factory Plugins: https://github.com/dmihal/burner-factory-plugins
.. _collectables plugin: https://github.com/dmihal/burner-factory-plugins/tree/master/plugins/collectable-plugin
.. _push notification plugin: https://github.com/dmihal/burner-factory-plugins/tree/master/plugins/push-notification-plugin


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
2. ``cd`` into the project directory, and run ``yarn install``
3. In order to use your app on Mainnet or testnets, you'll need an Infura API key. See the "envionment variables" section
4. Start your wallet! Run yarn start-local to run a wallet that connects to a local Ganache
   instance, or run yarn start-basic to run a wallet that connects to the Mainnet and xDai chains.
5. Navigate your browser to http://localhost:3000!

Option 2: Start from scratch
----------------------------

Creating a wallet with the Burner Wallet 2 does not require cloning any repository, as all
components are NPM packages. Simply create a new react project, install the packages, and create a
plugin entry point.

1. Run ``create-react-app my-wallet`` and ``cd`` to ``my-wallet``
2. Run ``yarn add @burner-wallet/core @burner-wallet/assets @burner-wallet/modern-ui @burner-wallet/types``
3. Paste the following code in index.tsx to create a simple wallet:

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

Environment Variables
---------------------





Typescript Support
------------------

The Burner Wallet 2 is natively built with Typescript, but you can write
your plugins in TypeScript or plain Javascript.

If you would like to write a plugin using Typescript, the only
dependency you need is @burner-wallet/types, which includes all the
typings you'll need.

If you want to write in plain javascript, then you don't need any
dependencies!


Create plugin entry point
=========================

If you have started from the sample project, you may skip this section.

Plugins are created by defining a class that implements the following Plugin interface.

.. code-block:: typescript

  export interface Plugin {
    initializePlugin(context: BurnerPluginContext): void;
  }

Create a new file with the following content:

.. code-block:: typescript

  import { Plugin, BurnerPluginContext } from '@burner-wallet/types'

  export default class MyPlugin implements Plugin {
    initializePlugin(pluginContext: BurnerPluginContext) {
      pluginContext.addElement('home-top', () => "Hello, World");
    }
  }

Import your class in your wallet entry point, and add it to the “plugins” array.

.. code-block:: typescript

  import MyPlugin from "../my-plugin/MyPlugin";

  const BurnerWallet = () =>
    <BurnerUI
      core={core}
      plugins={[new MyPlugin()]}
    />

Now, start your wallet development server by running ``yarn start``

Navigate to ``http://localhost:3000``. You should see a normal wallet with "Hello, World" written
at the top!

Adding a page
=============

Note: this step is completed by default in the sample project:

Create a new file with the following content:

.. code-block:: typescript

  import React from 'react';
  import { PluginPageContext, Asset } from '@burner-wallet/types';

  const MyPage: React.FC<PluginPageContext> = ({ BurnerComponents, assets, defaultAccount }) => {
    const { Page } = BurnerComponents;
    return (
      <Page title="My Page">
        <div>Account: {defaultAccount}</div>
        <div>Assets: {assets.map((asset: Asset) => asset.name).join(', ')}</div>
      </Page>
    );
  };

  export default MyPage;

Now import and add that page to the entry-point class:

.. code-block:: typescript

  import { Plugin, BurnerPluginContext } from '@burner-wallet/types';
  import MyPage from './MyPage';

  export default class MyPlugin implements Plugin {
    initializePlugin(pluginContext: BurnerPluginContext) {
      pluginContext.addPage('/mypage', MyPage);
    }
  }

We also want to add a button to the home page so that users can access the page:

.. code-block:: typescript

  import { Plugin, BurnerPluginContext } from '@burner-wallet/types';
  import MyPage from './MyPage';

  export default class MyPlugin implements Plugin {
    initializePlugin(pluginContext: BurnerPluginContext) {
      pluginContext.addPage('/mypage', MyPage);
      pluginContext.addButton('apps', 'My Page', '/mypage');
    }
  }

Interacting with a contract
===========================

This section will allow our plugin to interact with a smart contract using Web3.

First, we need to save the ``pluginContext`` to an instance variable so that it can be accessed
outside of the initializePlugin function.

.. code-block:: typescript

  import { Plugin, BurnerPluginContext } from '@burner-wallet/types';
  import MyPage from './MyPage';

  export default class MyPlugin implements Plugin {
    private pluginContext?: BurnerPluginContext;

    initializePlugin(pluginContext: BurnerPluginContext) {
      this.pluginContext = pluginContext;

      pluginContext.addPage('/mypage', MyPage);
      ...
    }
  }

Now, let's import our contract ABI from a JSON file and add a getContract function:

.. code-block:: typescript

  import { Plugin, BurnerPluginContext } from '@burner-wallet/types';
  import MyPage from './MyPage';
  import gameAbi from './game-abi.json';

  const GAME_CONTRACT_ADDRESS = '0x0123456789012345678901234567890123456789';

  export default class MyPlugin implements Plugin {
    private pluginContext?: BurnerPluginContext;

    initializePlugin(pluginContext: BurnerPluginContext) {
      this.pluginContext = pluginContext;

      pluginContext.addPage('/mypage', MyPage);
      ...
    }

    getContract() {
      const web3 = this.pluginContext!.getWeb3('100' /* xDai */);
      return new web3.eth.Contract(gameAbi as any, GAME_CONTRACT_ADDRESS);
    }
  }

Note the exclamation point after ``this.pluginContext``. Technically, it's possible that
pluginContext is ``undefined``, however we can assume that no code will run until after
initializePlugin has been called.

In that example, we have hardcoded the contract address and network ID. If you want the plugin to be
more flexible and reusable, you can also make those constructor arguments like this:


.. code-block:: typescript

  import { Plugin, BurnerPluginContext } from '@burner-wallet/types';
  import MyPage from './MyPage';
  import gameAbi from './game-abi.json';

  const GAME_CONTRACT_ADDRESS = '0x0123456789012345678901234567890123456789';

  export default class MyPlugin implements Plugin {
    private pluginContext?: BurnerPluginContext;
    private contractAddress: string;
    private chainId: string;

    constructor(contractAddress: string, chainId: string) {
      this.contractAddress = contractAddress;
      this.chainId = chainId;
    }

    initializePlugin(pluginContext: BurnerPluginContext) {
      this.pluginContext = pluginContext;

      pluginContext.addPage('/mypage', MyPage);
      ...
    }

    getContract() {
      const web3 = this.pluginContext!.getWeb3(this.chainId);
      return new web3.eth.Contract(gameAbi as any, this.contractAddress);
    }
  }

Now, let's add a some contract calls.

.. code-block:: typescript

  import { Plugin, BurnerPluginContext } from '@burner-wallet/types';
  import MyPage from './MyPage';
  import gameAbi from './game-abi.json';

  const GAME_CONTRACT_ADDRESS = '0x0123456789012345678901234567890123456789';

  export default class MyPlugin implements Plugin {
    private pluginContext?: BurnerPluginContext;
    private contractAddress: string;
    private chainId: string;

    constructor(contractAddress: string, chainId: string) {
      this.contractAddress = contractAddress;
      this.chainId = chainId;
    }

    initializePlugin(pluginContext: BurnerPluginContext) {
      this.pluginContext = pluginContext;

      pluginContext.addPage('/mypage', MyPage);
      ...
    }

    getContract() {
      const web3 = this.pluginContext!.getWeb3(this.chainId);
      return new web3.eth.Contract(gameAbi as any, this.contractAddress);
    }

    async getScore(address: string) {
      const contract = this.getContract();
      const score = await contract.methods.getScore(address).call();
      return score;
    }

    async buyTokens(address: string, numTokens: string) {
      const contract = this.getContract();
      await contract.methods.buyTokens(numTokens).send({ from: address });
    }
  }

Our plugin can now fetch data by calling ``getScore`` on this contract, as well as send a
transaction to the contract's ``buyTokens`` function.

Now, we can integrate these functions into our page:

.. code-block:: typescript

  import React, { useState, useEffect } from 'react';
  import { PluginPageContext } from '@burner-wallet/types';
  import MyPlugin from './MyPlugin';

  const MyPage: React.FC<PluginPageContext> = ({ BurnerComponents, defaultAccount }) => {
    const [score, setScore] = useState('');
    const [numTokens, setNumTokens] = useState('0');

    const _plugin = plugin as MyPlugin;

    useEffect(() => {
      _plugin.getScore(defaultAccount).then(score => setScore(score));
    }, []);

    const buyTokens = async () => {
      await _plugin.buyTokens(defaultAccount, numTokens);
      setNumTokens('0');

      const score = await _plugin.getScore(defaultAccount);
      setScore(score);
    };

    const { Page, Button } = BurnerComponents;
    return (
      <Page title="My Page">
        <div>Score: {score}</div>
        <div>
          <input type="number" value={numTokens} onChange={e => setNumTokens(e.target.value)} />
          <Button onClick={buyTokens}>Buy Tokens</Button>
        </div>
      </Page>
    );
  };

Users can now interact with the deployed contract!
