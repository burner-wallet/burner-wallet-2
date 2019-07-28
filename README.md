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

