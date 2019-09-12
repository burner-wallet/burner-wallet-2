## Burner Wallet 2.0

The Burner Wallet 2.0 is a modular, extendable and cusomizable web application for seamless crypto payments.

Create a burner wallet in just a few lines of code:

```JSX
const core = new BurnerCore({
  signers: [new InjectedSigner(), new LocalSigner()],
  gateways: [new InfuraGateway(process.env.REACT_APP_INFURA_KEY), new XDaiGateway()],
  assets: [xdai, dai, eth],
});

const exchange = new Exchange({ pairs: [xdaiBridge, uniswapDai] });

const BurnerWallet = () =>
  <BurnerUI
    core={core}
    plugins={[exchange, new LinkPlugin()]}
  />
```

### Running the wallet

#### Simple, customized wallet

Do you want to customize your own version of the wallet? Check out the simple application in the `basic-wallet` directory.

Alternatively, visit https://burnerfactory.com to create your own wallet without writing any code!

#### Developer wallet

Are you a developer, hoping to test changes to other modules in this project (burner-ui, exchange or plugins)?

The `local-wallet` diretory has a wallet that will connect to a local Ganache instance and transfer
10 Ganache ETH to your wallet.

To start this wallet, `cd` into the `local-wallet` directory, run `yarn install-all` to install
dependencies, then run `yarn start`.

Note that Metamask will override the local account, disable it or open in incognito mode for local development.

Alternatively, the code in the `wallet` directory will let you develop locally, while connecting to Mainnet and xDai.

## Customization

The wallet can be visually customized by passing `theme` and `title` props to the BurnerUI component.

```JSX
const theme = {
  background: '#282325',
  titleFont: '"workSans", sans-serif',
  paperBackground: '#282325',
  accentColor: '#E84441',
  homeButtonColor: '#BBBBBB',
};

const BurnerWallet = () =>
  <BurnerUI
    title="daedalus industries"
    theme={theme}
    core={core}
  />
```


## Packages

This is a monorepo that contains the following packages:

- `@burner-wallet/ui`: The basic UI structure for any Burner Wallet 
- `@burner-wallet/exchange`: An extendable plugin for implementing asset exchanges and bridges
- `@burner-wallet/plugins`: Collection of standard Burner Wallet plugins (see below)

The Burner Wallet 2 is dependent on the [`burner-core`](austintgriffith/burner-core) packages
(`@burner-wallet/core` and `@burner-wallet/assets`) for handling core blockchain functionality.

## Plugin Development

The burner wallet functionality can be extended by passing plugin objects to the BurnerUI component.

### Sample Plugins

The following plugins are part of the `@burner-wallet/plugins` package, and can be considered "offically supported"

* **[Exchange](/exchange)**: For exchanging or bridging different assets. Note that the exchange itself is also extendable
  by adding new exchange pairs.
* **[LegacyPlugin](/plugins/src/legacy)**: Supports URLs and QR codes from Austin's original burner code
* **[LinkPlugin](/plugins/src/link)**: Allows generating links, which can be opened to claim tokens

There are also a number of other plugins that have been developed, which may be useful for reference:

* **[VendorPlugin](https://github.com/dmihal/burner-wallet-vendor-plugin)**: Use the burner wallet for ordering off a pre-set menu
* **[HelenaPlugin](https://github.com/dmihal/helena-burner-plugin)**: Support for Helena prediction markets
* **[ScorpioPlugin](https://github.com/dmihal/scorpio-plugin)**: For connecting wallets with social media accounts
* **[DaedalusIndustriesPlugin](https://github.com/dmihal/daedalus-industries/tree/master/wallet/src/daedalus-plugin)**: Created for the escape room at ETHBerlin 2019, this plugin facilitates staking
  an asset in a contract, collecting private keys as "clues", and submitting signed messages to the game contract.

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
* `onQRScanned: (callback: (qr: string, { actions }) => bool) => void`: Provide a function to be
  called when the user scans a QR code on the home page. The function is passed the text of the QR
  code and the "actions" object (see below). The function must return true if is taking an action
  based on the QR code. _Note: URLs on the wallet's current domain are automatically handled_

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
  * `burnerComponents.AccountBalance`: Provides the balance of an account through a render prop
  * `burnerComponents.AccountKeys`: Provides information about signing keys through a render prop
  * `burnerComponents.AmountInput`: Component to input values of various assets (xDai, ETH)
  * `burnerComponents.AssetSelector`: A drop down for selecting an asset
  * `burnerComponents.Assets`: Provides an array of assets through a render prop
  * `burnerComponents.Button`: A simple, styled button to click on
  * `burnerComponents.Page`: Container for a visual page component
  * `burnerComponents.QRCode`: Renders a QR code
  * `burnerComponents.TransactionDetails`: Provides details about a transaction through a render prop
