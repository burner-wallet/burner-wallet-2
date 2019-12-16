API Reference
=============


Plugin Context
--------------

When the wallet is loaded, the wallet will call the
``initializePlugin(pluginContext)`` function for each plugin. The plugin
has access to the following methods of pluginContext object:

-  ``addElement: (position: string, Component: PluginElement) => void``:
   Add a React component to a defined position in the app. The following
   positions are supported: “home-top”, “home-middle” and “home-bottom”.
-  ``addHomeButton: (title: string, path: string) => void``: Adds a
   button to the home screen that will link to the provided path.
-  ``addPage: (path: string, Component: PluginPage) => void``: Add a
   React component to the router at the provided path.
-  ``getAssets: () => Asset[]``: Returns all assets.
-  ``getWeb3: (network: string, options?: any) => void``: Returns a Web3
   object for the provided network ID (ex: ‘1’ for mainnet, ‘100’ for
   xDai).
-  ``onAccountSearch: (callback: (query: string) => Promise<Account[]>) => void``:
   Provide a function to be called when the user types into an account
   input field. Used to suggest accounts to the user.
-  ``onQRScanned: (callback: (qr: string, { actions }) => bool) => void``:
   Provide a function to be called when the user scans a QR code on the
   home page. The function is passed the text of the QR code and the
   “actions” object (see below). The function must return true if is
   taking an action based on the QR code. *Note: URLs on the wallet’s
   current domain are automatically handled*
-  ``onSent: (callback: (txData) => string | null) => void``: Provide a
   function to be called when the user sends an asset through the normal
   send mechanism. Callback will receive an object with the asset,
   sender and recipient address, amount, message, web3 receipt,
   transaction hash and an id if specified in the send function. If the
   function returns a string, the wallet will redirect to that address.

Burner Plugin Props
-------------------

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