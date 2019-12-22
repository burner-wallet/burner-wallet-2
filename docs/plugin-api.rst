*************
API Reference
*************

============
Plugin Class
============

All plugins are defined by creating a simple class that implements the following ``initializePlugin``
method:

.. code-block:: typescript

   interface Plugin {
     initializePlugin(context: BurnerPluginContext): void;
   }

Inside this method, plugins declare all wallet integrations using the Plugin Context API.

The Plugin Class is also an ideal location to define blockchain logic, since React components will
have access to the plugin instance.


.. code-block:: typescript

   import { Plugin, BurnerPluginContext } from '@burner-wallet/types'
   import Game from './ui/Game';
   import gameAbi from './gameAbi.json';

   const GAME_ADDRESS = '0x0123456789012345678901234567890123456789';

   export default class GamePlugin implements Plugin {
     private pluginContext?: BurnerPluginContext;

     initializePlugin(pluginContext: BurnerPluginContext) {
       this.pluginContext = pluginContext;

       pluginContext.addPage('/game', Game);
       pluginContext.addButton('apps', '/game', {
         'description': 'Play this fun game!',
       });
     }

     getContract() {
       const web3 = this.pluginContext!.getWeb3('1');
       const contract = new web3.eth.Contract(gameAbi, GAME_ADDRESS);
       return contract;
     }

     async getScore(userAddress) {
       const contract = this.getContract();
       const score = await contract.methods.getScore(userAddress).call();
       return score;
     }
   }


==============
Plugin Context
==============

When the wallet is loaded, the wallet will call the ``initializePlugin(pluginContext)`` function for
each plugin. This function is provided an object with the following interface:

.. code-block:: typescript

   interface BurnerPluginContext {
     addElement: (position: string, Component: PluginElement, options?: any) => void;
     addButton: (position: string, title: string, path: string, options?: any) => any;
     addPage: (path: string, Component: PluginPage) => any;
     getAssets: () => Asset[];
     getWeb3: (network: string, options?: any) => Web3;
     addAddressToNameResolver: (callback: AddressToNameResolver) => void;
     onAccountSearch: (callback: AccountSearchFn) => void;
     onQRScanned: (callback: QRScannedFn) => void;
     onSent: (callback: TXSentFn) => void;
   }


addElement
==========

.. code-block:: typescript

   pluginContext.addElement(position: string, Component: React.ComponentType, [options?: any])

Adds a React component to a defined position in an existing wallet page.

Paramaters
----------

  - ``position``: The defined position in the application to insert the component at. The
  ModernUI defines the following positions:
    - ``home-top``
    - ``home-middle``
    - ``home-bottom``
    - ``home-tab``: Adds component as a tab on the home page. Accepts an option with the value
``title``
    - ``advanced``
  - ``Component``: The React component to be used. The component will receive the Burner Plugin
Component Props
  - ``options``: Some positions may expect additional options to be provided


Example
-------

.. code-block:: typescript

   import { Plugin, BurnerPluginContext } from '@burner-wallet/types';
   import BalanceTab from './Username';
   import BalanceTab from './BalanceTab';

   export default class BalancePlugin implements Plugin {
     initializePlugin(context: BurnerPluginContext) {
       context.addElement('home-middle', Username);
       context.addElement('home-tab', BalanceTab, { title: 'Cash' });
     }
   }

addPage
=======

.. code-block:: typescript

   pluginContext.addPage(path: string, Component: React.ComponentType)

Creates a new page in the wallet with it's own URL route.

addButton
=========

.. code-block:: typescript

   pluginContext.addButton(position: string, title: string, path: string, [options?: any])

Add a button do a pre-defined location in the wallet.

Paramaters
----------

  - ``position``: A button position defined by the Wallet UI. Currently, ModernUI only supports
"app", while ClassicUI only supports "home"
  - ``title``: The text to display in the button
  - ``path``: The URL path to navigate to when clicked
  - ``options``: Additional data to provide the button. For example, ModernUI accepts
``description`` and ``icon`` values.

Example
-------
.. code-block:: typescript

   import { Plugin, BurnerPluginContext } from '@burner-wallet/types';

   export default class MenuPlugin implements Plugin {
     initializePlugin(context: BurnerPluginContext) {
       pluginContext.addButton('apps', 'Drink Menu', '/menu', {
         description: 'Order drinks from the bar',
         icon: '/beericon.png',
       });
     }
   }

getAssets
=========

.. code-block:: typescript

   pluginContext.getAssets(): Asset[]

Returns an array of all Asset objects used by the wallet.

getWeb3
=======

.. code-block:: typescript

   pluginContext.getWeb3(chain: string): Web3

Returns a Web3 instance for the requested chain. This allows lower-level blockchain calls (querying
transactions & blocks) as well as constructing Web3 Contract instances.

Note: Burner Wallet uses Web3 v1.2.x

Paramaters
----------

  - ``chain``: The chain ID for the requested chain (ex: '1' for mainnet, '42' for Kovan testnet,
'100' for xDai)

Example
-------

.. code-block:: typescript

   import { Plugin, BurnerPluginContext } from '@burner-wallet/types'

   const GAME_ADDRESS = '0x0123456789012345678901234567890123456789';

   export default class GamePlugin implements Plugin {
     private pluginContext?: BurnerPluginContext;
     import gameAbi from './gameAbi.json';

     initializePlugin(pluginContext: BurnerPluginContext) {
       this.pluginContext = pluginContext;
     }

     async getBlockNumber() {
       const web3 = this.pluginContext!.getWeb3('1');
       return await web3.eth.getBlockNumber();
     }

     getContract() {
       const web3 = this.pluginContext!.getWeb3('1');
       const contract = new web3.eth.Contract(gameAbi, GAME_ADDRESS);
       return contract;
     }

     async getScore(userAddress) {
       const contract = this.getContract();
       const score = await contract.methods.getScore(userAddress).call();
       return score;
     }
   }

addAddressToNameResolver
========================

.. code-block:: typescript

   type AddressToNameResolver = (address: string) => Promise<string | null>;

   pluginContext.addAddressToNameResolver(callback: AddressToNameResolver);

This API allows plugins to provide human-readable names for addresses displayed in the wallet UI.
For example, the ENS plugin uses this to replace addresses with ENS names.

Paramaters
----------

  - ``callback``: A function that can resolve addresses to human readable names. Callbacks are
passed an Ethereum address as a paramater, and should return a string or ``null`` if the address
can not be resolved.

Example
-------

.. code-block:: typescript

   import { BurnerPluginContext, Plugin, Account } from '@burner-wallet/types';

   export default class ENSPlugin implements Plugin {

     initializePlugin(pluginContext: BurnerPluginContext) {
       pluginContext.addAddressToNameResolver(async (address: string) => {
         const name = await ens.reverseLookup(address);
         return name;
       });
     }
   }

onAccountSearch
===============

.. code-block:: typescript

   type AccountSearchFn = (query: string) => Promise<Account[]>;

   pluginContext.onAccountSearch(callback: AccountSearchFn)

This API allows plugins to suggest accounts to user when they are typing in the "address" field for
a new transaction. For example, the ENS Plugin uses this API to resolve ENS names, while the Recent
Accounts Plugin uses this API to suggest accounts that the user has recently interacted with.

Paramaters
----------

  - ``callback``: A function that will receive a search query as a paramater, and should return an
array of "Account" objects (or an empty array). "Accounts" are objects that contain an "address"
and "name" property.

Example
-------
.. code-block:: typescript

   import { BurnerPluginContext, Plugin } from '@burner-wallet/types';

   export default class ENSPlugin implements Plugin {

     initializePlugin(pluginContext: BurnerPluginContext) {
       pluginContext.onAccountSearch(async (search: string) => {
         if (search.length < 3) {
           return [];
         }
         const address = await ens.getAddress(search);
         return address ? [{ address: address, name: search }] : [];
       });
     }
   }


onQRScanned
===========

.. code-block:: typescript

   type QRScannedFn = (qr: string, context: { actions: Actions }) => boolean | undefined;

   pluginContext.onQRScanned(callback: QRScannedFn)

Provide a function to be called when the user scans a QR code using the default QR code scanner. The
function is passed the text of the QR code and the "actions" object (see below).

For example, the ERC681 plugin uses this API to handle QR codes that contain the ERC681 URI format
(``ethereum:0xf01acd...```).

Note: URLs of the same domain as the wallet are automatically handled. For example, if a wallet is
hosted at ``mywallet.com`` and the user scans a QR code for ``https://mywallet.com/mypage``, then
the wallet will automatically route to ``/mypage``.

Paramaters
----------

  - ``callback``: A function that parses the scanned QR code string and can chose to take action.
This function must return ``true`` if it choses to handle this QR code, or else the wallet will
continue to pass the value to other plugins. The function receives the following paramaters
    - ``qr``: The string value of the scanned QR code
    - ``context``: This object currently only contains a single paramater, ``actions``. However,
more values may be added in the future.

Example
-------
.. code-block:: typescript

   import { BurnerPluginContext, Plugin } from '@burner-wallet/types';

   export default class ERC681Plugin implements Plugin {
     initializePlugin(pluginContext: BurnerPluginContext) {
       pluginContext.onQRScanned((qr: string, ctx: any) => {
         if (qr.indexOf('ethereum:') === 0) {
           const parsed = parse(qr);

           if (parsed === null) {
             return false;
           }

           ctx.actions.send({
             to: parsed.recipient,
             value: parsed.value,
             asset: parsed.asset,
           });

           return true;
         }
         return false;
       });
     }
   }


onSent
======

.. code-block:: typescript

   type TXSentFn = (data: SendData) => string | void | null;

   pluginContext.onSent(callback: TXSentFn);

Provide a function to be called when the user sends an asset through the normal send mechanism.
Callback will receive an object with the asset, sender and recipient address, amount, message, Web3
receipt, transaction hash, and an ID if specified in the send function.

Typically, a user will be redirected to the Receipt page after a transaction has been sent. However,
plugins can override this behavior by returning a path string from the onSent callback.

Example
-------

.. code-block:: typescript

   import { BurnerPluginContext, Plugin, SendData } from '@burner-wallet/types';
   import OrderCompletePage from './OrderCompletePage';

   export default class ShoppingPlugin implements Plugin {
     initializePlugin(pluginContext: BurnerPluginContext) {
       pluginContext.addPage('/order-complete/:id', OrderCompletePage);

       pluginContext.onSent((tx: SendData) => {
         if (tx.id.indexOf('order:') === 0) {
           return `/order-complete/${tx.id.substr(6)}`;
         }
       });
     }
   }

Burner Plugin Component Props
=============================

Pages (added with ``pluginContext.addPage``) and elements (added with
``pluginContext.addElement``) will receive the following props:

-  ``assets``: an array of Asset objects
-  ``defaultAccount``: the primary account used by the wallet.
   Equivalent to ``accounts[0]``.
-  ``accounts``: an array of ethereum addresses that are available to
   use.
-  ``actions``: an object containing a number of functions that plugins
   may call:

   -  ``actions.scanQRCode()``: Opens a full-screen QR code scanner.
      Returns a promise, which is resolved to the scanned value or
      rejected if the user cancels the scan.
   -  ``actions.openDefaultQRScanner()``: Opens a full-screen QR code
      scanner, and will automatically handle the scanned code depending
      on the scanned value, in the following order:

      -  Plugins can chose to handle scanned QR codes by calling
         ``onQRScanned`` and returning ``true``
      -  Scanned addresses will redirect to the Send page
      -  Scanned private keys will invoke ``safeSetPK``
      -  Scanned URLs that match the domain the wallet is on will be
         automatically routed

   -  ``actions.safeSetPK(newPK)``: Set a new private key. If the user already has funds, they will be prompted to move their funds to the new account, or move funds from the new account to the existing account