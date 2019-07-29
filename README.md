## Burner Wallet 2.0

The Burner Wallet 2.0 is a modular, extendable and cusomizable web application for seamless crypto payments.

### Running the wallet

#### Simple, customized wallet

Do you want to customize your own version of the wallet? Check out the simple application in the `basic-wallet` directory.

Alternatively, visit https://burnerfactory.com to create your own wallet without writing any code!

#### Developer wallet

Are you a developer, hoping to test changes to other modules in this project (burner-ui, exchange or plugins)?
The code in the `wallet` directory will directly link to the source code of other projects, and give you hot reloading.


## Packages

This is a monorepo that contains the following packages:

- `@burner-wallet/ui`: The basic UI structure for any Burner Wallet 
- `@burner-wallet/exchange`: An extendable plugin for implementing asset exchanges and bridges

## Plugin Development

The burner wallet functionality can be extended by passing plugin objects to the BurnerUI component.

### Plugin Context

When the wallet is loaded, the wallet will call the `initializePlugin(pluginContext)` function for
each plugin. The plugin has access to the following methods of pluginContext object:

* `addElement: (position: string, Component: PluginElement) => void`: Add a React component to a
  defined position in the app. The following positions are supported: "home-top", "home-middle"
  and "home-bottom".
* `addHomeButton: (title: string, path: string) => void`: Adds a button to the home screen that
  will link to the provided path.
* `addPage: (path: string, Component: PluginPage) => void`: Add a React component to the router at
  the provided path.
* `getAssets: () => Asset[]`: Returns all assets.
* `getWeb3: (network: string, options?: any) => void`: Returns a Web3 object for the provided
  network ID (ex: '1' for mainnet, '100' for xDai).
* `onAccountSearch: (callback: (query: string) => Promise<Account[]>) => void`: Provide a function
  to be called when the user types into an account input field. Used to suggest accounts to the user.

### Burner Plugin Props

Pages (added with `pluginContext.addPage`) and elements (added with `pluginContext.addElement`) will
receive the following props:

* `assets`: an array of Asset objects
* `accounts`: an array of ethereum addresses that are available to use. Typically `account[0]` is
  used. Note that the accounts array may be empty when the application is first loaded.
* `actions`: an object containing a number of functions that plugins may call:
  * `actions.scanQrCode()`: Opens a full-screen QR code scanner. Returns a promise, which is
    resolved to the scanned value or rejected if the user cancels the scan.
  * `actions.send({ to, from, asset, ether })`: Call to send an asset. Will redirect the user to a send
    confirmation page.
  * `actions.navigateTo(path, [state])`: Navigates the app to a new URL.
  * `actions.callSigner(action, ...props)`: call functions in the signer objects. Used for burning
    accounts or setting new private keys.
  * `actions.canCallSigner(action, ...props)`: check if a function is available to call.
* `burnerComponents`: an object containing a number of useful React components
  * `burnerComponents.Page`: Container for a visual page component
  * `burnerComponents.AssetSelector`: A drop down for selecting an asset
  * `burnerComponents.AccountBalance`: Provides the balance of an account through a render prop
  * `burnerComponents.AccountKeys`: Provides information about signing keys through a render prop
  * `burnerComponents.Assets`: Provides an array of assets through a render prop
  * `burnerComponents.TransactionDetails`: Provides details about a transaction through a render prop
  * `burnerComponents.QRCode`: Renders a QR code
