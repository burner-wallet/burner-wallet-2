## Burner Wallet 2.0

The Burner Wallet 2.0 is a modular, extendable and customizable web application for seamless crypto payments.

Create a burner wallet in just a few lines of code:

```JSX
const core = new BurnerCore({
  signers: [new InjectedSigner(), new LocalSigner()],
  gateways: [new InfuraGateway(process.env.REACT_APP_INFURA_KEY), new XDaiGateway()],
  assets: [xdai, dai, eth],
});

const exchange = new Exchange({ pairs: [new XDaiBridge(), new Uniswap('dai')] });

const BurnerWallet = () =>
  <ModernUI
    core={core}
    plugins={[exchange, new ENSPlugin()]}
  />
```

### Full documentation

Visit https://burner-wallet.readthedocs.io/ for more documentation on using the Burner Wallet libraries.

### Building a Wallet

#### Simple, customized wallet

Do you want to customize your own version of the wallet? This repo contains the source files for
the Burner Wallet 2 libraries, but you don't need to download or fork this to build a Burner Wallet!

Check out [sample-wallet](https://github.com/burner-wallet/sample-wallet) to build a simple,
customized wallet. If you're interested in building a Burner Wallet plugin, check out the
[sample-plugin](https://github.com/burner-wallet/sample-plugin) repo.


Alternatively, visit https://burnerfactory.com to create your own wallet without writing any code!

##### Setting Infura key

By default, `basic-wallet` uses the InfuraGateway for connecting to commonly used Ethereum chains.

The entry point takes an Infura key from the `REACT_APP_INFURA_KEY` environment variable. For your wallet to
function correctly, you must create a file named `.env` in the `basic-wallet` folder with the following value:

```
REACT_APP_INFURA_KEY=<your infura key>
```

You can generate an Infura key at https://infura.io/

##### Add a custom token

You can add any ERC20 token to your wallet by constructing a new ERC20Asset and adding it to the asset list.

The `id` parameter is the internal ID used by the wallet, while the `name` parameter is the display name
that will be displayed to the user. `network` is the chain ID of the chain the token is deployed to
(`'1'` for mainnet, `'100'` xDai, etc). `address` is the address where the token contract is deployed.

```JS
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
```

#### Local developer wallet

Are you a developer, hoping to test changes to other modules in this project (modern-ui, ui-core or various plugins)?

In the project root, run these commands:
```
yarn install
yarn run build
yarn start-local
```
This will start a wallet on http://localhost:3000 that is connected to your local
Ganache instance (connecting to node http://localhost:8545 by default).

Before the wallet server launches, a script create a pre-filled account. This account will hold 1 Ganache ETH and 100
test tokens.

Note that Metamask will override the local account, disable it or open in incognito mode for local development.

## Packages

This is a monorepo that contains the following packages:

- `@burner-wallet/modern-ui`: The standard user interface for burner wallets
- `@burner-wallet/classic-ui`: The original burner wallet design. Maintained for nostalgia.
- `@burner-wallet/ui-core`: The core UI logic for all burner wallets (not to be confused with the @burner-wallet/core
  package, which contains core blockchain logic).
- `@burner-wallet/types`: Typescript type bindings

Plugins:

- `@burner-wallet/exchange`: An extendable plugin for implementing asset exchanges and bridges
- `@burner-wallet/ens-plugin`: Support for the Ethereum Name Service
- `@burner-wallet/erc681-plugin`: Support for scanning ERC681 payment request QR codes
- `@burner-wallet/legacy-plugin`: Allow scanning old paper wallets and handling old URL routes
- `@burner-wallet/link-plugin`: Send tokens to friends over text by sending funds to a URL
- `@burner-wallet/metamask-plugin`: Button to unlock Metamask. Requires `InjectedSigner`
- `@burner-wallet/recent-accounts-plugin`: Suggest recent accounts when sending funds
- `@burner-wallet/seed-phrase-plugin`: Load accounts by seed phrase

The Burner Wallet 2 is dependent on the [`burner-core`](austintgriffith/burner-core) packages
(`@burner-wallet/core` and `@burner-wallet/assets`) for handling core blockchain functionality.

## Plugin Development

The burner wallet functionality can be extended by passing plugin objects to the BurnerUI component.

### Reference Plugins

This repo contains a number of standard plugins that can be considered "officially supported"

- **[Exchange](/packages/exchange)**: For exchanging or bridging different assets. Note that the exchange itself is also extendable
  by adding new exchange pairs.
- **[LegacyPlugin](/packages/legacy)**: Supports URLs and QR codes from Austin's original burner code
- **[LinkPlugin](/packages/link)**: Allows generating links, which can be opened to claim tokens

The burner-factory-plugins repo also contains a number of other plugins:

- **[@burner-factory/collectable-plugin](https://github.com/dmihal/burner-factory-plugins/tree/master/plugins/collectable-plugin)**: A plugin for collecting NFTs
- **[@burner-factory/order-menu-plugin](https://github.com/dmihal/burner-factory-plugins/tree/master/plugins/order-menu-plugin)**: Plugin for ordering predefined menu items. Useful for food/drink events.
- **[@burner-factory/schedule-plugin](https://github.com/dmihal/burner-factory-plugins/tree/master/plugins/schedule-plugin)**: Displays schedules in the wallet. Useful for events.
- **[@burner-factory/stock-market-menu-plugin](https://github.com/dmihal/burner-factory-plugins/tree/master/plugins/stock-market-menu-plugin)**: Similar to the order-menu-plugin, this allows users to order pre-defined items off a menu. However, a contract adjusts the price according to supply and demand.
