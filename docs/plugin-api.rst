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

  - ``position``: The defined position in the application to insert the component at. The ModernUI defines the following positions:

      - ``home-top``
      - ``home-middle``
      - ``home-bottom``
      - ``home-tab``: Adds component as a tab on the home page. Accepts an option with the value ``title``
      - ``advanced``

  - ``Component``: The React component to be used. The component will receive the Burner Plugin Component Props
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

  - ``position``: A button position defined by the Wallet UI. Currently, ModernUI only supports "app", while ClassicUI only supports "home"
  - ``title``: The text to display in the button
  - ``path``: The URL path to navigate to when clicked
  - ``options``: Additional data to provide the button. For example, ModernUI accepts ``description`` and ``icon`` values.

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

  - ``chain``: The chain ID for the requested chain (ex: '1' for mainnet, '42' for Kovan testnet, '100' for xDai)

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

  - ``callback``: A function that will receive a search query as a paramater, and should return an array of "Account" objects (or an empty array). "Accounts" are objects that contain an "address" and "name" property.

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

  - ``callback``: A function that parses the scanned QR code string and can chose to take action. This function must return ``true`` if it choses to handle this QR code, or else the wallet will continue to pass the value to other plugins. The function receives the following paramaters
      - ``qr``: The string value of the scanned QR code
      - ``context``: This object currently only contains a single paramater, ``actions``. However, more values may be added in the future.

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


sendPluginMessage
===============

.. code-block:: typescript

   actions.sendPluginMessage(topic: string, ...message: any[]): any

Send cross-plugin messages

Paramaters
----------

   - ``topic``: Topic ID that other plugins are listening for
   - All other arguments will be included

Example
-------

.. code-block:: typescript

   import { BurnerPluginContext, Plugin, SendData } from '@burner-wallet/types';

   export class NamePlugin implements Plugin {
     private pluginContext: BurnerPluginContext;

     initializePlugin(pluginContext: BurnerPluginContext) {
       this.pluginContext = pluginContext;
     }

     changeName(newName: string) {
       this.pluginContext!.sendPluginMessage('name-changed', newName);
     }
   }

   export class OtherPlugin implements Plugin {
     private pluginContext: BurnerPluginContext;

     initializePlugin(pluginContext: BurnerPluginContext) {
       pluginContext.onPluginMessage('name-changed', (newName) => console.log('new name', newName));
     }
   }

onPluginMessage
===============

.. code-block:: typescript

   type PluginMessageListener = (...message: any[]) => any;

   actions.onPluginMessage(topic: string, listener: PluginMessageListener)

Paramaters
----------

   - ``topic``: Topic ID to listen for
   - ``listener``: A callback that will be passed all arguments from the message sender

Example
-------

See example for sendPluginMessage

======================
Plugin Component Props
======================

Pages (added with ``pluginContext.addPage``) and elements (added with ``pluginContext.addElement``) 
will receive the following props.

``plugin``
==========

Pages and Elements are provided with the instance of the Plugin that added them. This allows React
components to access values from the plugin constructor, Web3 instances, and more.

Example
-------

.. code-block:: typescript

   import { BurnerPluginContext, Plugin } from '@burner-wallet/types';

   export default class MyPlugin implements Plugin {
     public id: string;
     private pluginContext?: BurnerPluginContext;

     constructor(id: string) {
       this.id = id;
     }

     initializePlugin(pluginContext: BurnerPluginContext) {
       this.pluginContext = pluginContext;
       pluginContext.addPage('/myPage', MyPage);
     }

     async send(account: string) {
       const web3 = this.pluginContext!.getWeb3('100');
       const contract = new web3.eth.Contract(abi, address);
       await contract.methods.myMethod().send({ from: account });
     }
   }

   const MyPage: React.FC<> = ({ plugin, defaultAccount }) => {
     const _plugin = plugin as MyPlugin;
     return (
       <div>
         <h1>ID: {_plugin.id}</h1>
         <button onClick={() => _plugin.send()}>Send Tx</button>
       </div>
     );
   };

``assets``
==========

``Array[]``

An array of Asset objects.

``defaultAccount``
==================

``string``

The Ethereum address of the default account (equivelent to ``accounts[0]``).

``accounts``
============

``string[]``

An array of addresses representing all available accounts.

``actions``
===========

Object containing a number of functions. See Actions section.

``BurnerComponents``
====================

An object containing a number of React components that can be used. See the Burner Components section.

React Router props
==================

Page components (added with ``addPage``) will also receive the match_, location_ and history_ props
from React Router.

.. _match: https://reacttraining.com/react-router/web/api/match
.. _location: https://reacttraining.com/react-router/web/api/location
.. _history: https://reacttraining.com/react-router/web/api/history

Typescript users may define expected paramaters by passing a type argument to ``PluginPageContext``.

Example
-------

.. code-block:: typescript

   import { PluginPageContext } from '@burner-wallet/types';

   interface MatchParams {
     level: string;
   }

   const Game: React.FC<PluginPageContext<MatchParams>> = ({ match }) => {
     return (
       <div>Welcome to level {match.params.level}</div>
     );
   };

=======
Actions
=======

callSigner
==========

.. code-block:: typescript

   actions.callSigner(action: string, target: string, ...props: any[]): string

Calls a method defined by the signer.

Paramaters
----------

   - ``action``: The method to call. LocalSigner supports the methods "readKey", "writeKey", "burn", while InjectedSigner supports "enable".
   - ``target``: Either the address to call an action on (``0x9f31ca...``) or the ID of a signer (``local``, ``injected``).
   - ``props``: Additional arguments, dependent on the actions.

Example
-------

.. code-block:: jsx

   const PrivateKeyChanger = ({ actions, defaultAccount }) => {
     const [newKey, setNewKey] = useState('');
     const canChangeKey = actions.canCallSigner('writeKey', defaultAccount);

     return (
      <div>
         {canChangeKey ? (
            <div>
              <input value={newKey} onChange={e => setNewKey(e.target.value)} />
              <button onClick={() => actions.callSigner('writeKey', defaultAccount, newKey)}>
                Change Key
              </button>
            <div>
         ) : "Can not update private key"}
      </div>
     );
   };

canCallSigner
=============

.. code-block:: typescript

   actions.canCallSigner(action: string, target: string, ...props: any[]): boolean

Paramaters
----------

   - ``action``: The method to call. LocalSigner supports the methods "readKey", "writeKey", "burn", while InjectedSigner supports "enable".
   - ``target``: Either the address to call an action on (``0x9f31ca...``) or the ID of a signer (``local``, ``injected``).
   - ``props``: Additional arguments, dependent on the actions.

Example
-------

See example for ``callSigner``

openDefaultQRScanner
====================

.. code-block:: typescript

   actions.openDefaultQRScanner(): Promise

Open the full-screen QR code scanner. If a QR code is scanned, it will be handled with the default
logic.

The default logic is as follows:

1. Plugins may handle QR codes by returning true from their ``onQRScanned`` callback.
2. If an address was scanned, the user will be redirected to the send page
2. If a private key was scanned, it will be handled with ``safeSetPK``
2. URLs that contain the same domain as the wallet will be automatically routed


scanQRCode
==========

.. code-block:: typescript

   actions.scanQRCode: () => Promise<string>

Opens the full-screen QR code scanner. Unlike ``openDefaultQRScanner``, there is no default logic
for handling the scanned QR code. The promise will resolve once a QR code is scanned, or will reject
if the user cancels.

safeSetPK
=========

.. code-block:: typescript

   actions.safeSetPK(newPK: string)

Attempts to update the user's private key, without losing any funds.

1. If there is no balance in the existing account, the new private key will be automatically updated
2. If the current account has funds, the user will be prompted with the following options:

   - Move all assets from the existing account to the new account
   - Move all assets from the new account to the existing account
   - Discard funds in the existing account and switch to the new account
   - Cancel, maintaining the current account

send
====

.. code-block:: typescript

   actions.send(params: SendData)

Prompt the user to send an asset, redirecting them to the send confirmation page.

Paramaters
----------

TODO

navigateTo
==========

.. code-block:: typescript

   actions.navigateTo(location: string | number, [state?: any])

Navigate the app's internal router to the path described (react-router is used internally).

Alternatively, pass a number to navigate forward or backwards through the history (pass ``-1`` to
go back).

Example
-------

.. code-block:: jsx

   const MyPage = ({ actions }) => (
     <div>
       <Button onClick={() => actions.navigateTo('/game')}>Game</Button>
       <Button onClick={() => actions.navigateTo('/game', { level: 2 })}>Level 2</Button>
       <Button onClick={() => actions.navigateTo(-1)}>Back</Button>
     </div>
   );

setLoading
==========

.. code-block:: typescript

   actions.setLoading(status: string | null)

getHistoryEvents
================

.. code-block:: typescript

   actions.getHistoryEvents([options?: any]): HistoryEvent[]

onHistoryEvent
==============

.. code-block:: typescript

   actions.onHistoryEvent(callback: HistoryEventCallback)

removeHistoryEventListener
==========================

.. code-block:: typescript

   actions.removeHistoryEventListener(callback: HistoryEventCallback)

================================
Burner Components: UI Components
================================

Page
====

Props
-----

   - ``title``: (string) Page title to display at top of page
   - ``children``: (React node) Page content

Example
-------

.. code-block:: jsx

   const MyPage = ({ BurnerCompents }) => {
     const { Page } = BurnerComponents;
     return (
       <Page title="My Page">
         Content
       </Page>
     );
   };

AssetSelector
=============

TODO

AmountInput
===========

TODO

Button
======

TODO

QRCode
======

TODO

=================================
Burner Components: Data Providers
=================================

A number of non-visual components are available. Many of these components simplify the process of
accessing blockchain data using render props.

AccountBalance
==============

Props
-----

   - ``asset``: (string or Asset)
   - [``account``]: (string) Account to look up data from. Optional, will use the default account if omitted
   - ``render``: (callback)

Callback data
-------------

The callback will be called with ``null`` while data is loading or unavailable. Once loaded, the
callback will be called with an object with the following properties:


   - ``balance``: (string) The account balance, in wei-equivelent units (the balance divided by 10^18)
   - ``displayBalance``: (string) The balance in decimal format
   - ``maximumSendableBalance``: (string) The maximum that can be sent. For native assets like ETH, this will be the total balance minus the gas fee for a simple transaction
   - ``displayMaximumSendableBalance``: (string) ``maximumSendableBalance`` in decimal format
   - ``usdBalance``: (string | ``null``) If price data is available, it will be the balance multiplied by the balance

Example
-------

TODO

AccountKeys
===========

TODO

AddressName
===========

Retrieves the human-readable name for an address, if available

Props
-----

   - ``address``
   - ``render``

Callback data
-------------

The render method will be called with two arguments:

   - ``name`` (string or ``null``) The human readable name, if available
   - ``address`` (string)

Example
-------

TODO

History
=======

Render a list of history events

Props
-----

   - ``account``: (string) The Ethereum account to fetch history for
   - ``render``: (callback) Render function that will be called once for each history element

Callback data
-------------

Example
-------

TODO

PluginButtons
=============

Define a region where other plugins may insert elements

Props
-----

   - ``position``: (string) The name of the position
   - ``Component``: (React Component) Optional, the component to render each button. If omitted, ``Button`` will be used
   - Other props will be passed through to inserted buttons

PluginElements
==============

Define a region where other plugins may insert elements

Props
-----

   - ``position``: (string) The name of the position
   - Other props will be passed through to inserted elements

TransactionDetails
==================

Props
-----
   - ``asset``: (string) Asset ID
   - ``txHash``: (string) Transaction hash
   - ``render``: (callback) Render function

Callback data
-------------

The render function will provide a single SendData object with the following properties;

   - ``asset``: (string);
   - ``value``: (string) The amount transfered, in wei-equivelent units
   - ``ether``: (string) The amount transfered, in ether-equivelent units (typically ``value * (10 ** 18)``)
   - ``from``: (string) The transaction sender
   - ``to``: (string) The transaction recipient (note: if this is a token transfer, it will be the transfer recipient, not the transaction recipient)
   - ``message``?: (string or ``null``) The transaction message or ``null``
   - ``hash``?: (string) Transaction hash
   - ``timestamp``: (number) Unix timestamp of the transaction (block time)

Example
-------

TODO
