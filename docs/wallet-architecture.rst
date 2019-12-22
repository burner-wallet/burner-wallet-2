*******************
Wallet Architecture
*******************

A Burner Wallet is created by composing a number of independent modules into a single web
application.

The following will outline the various modules from the lowest-level up to the higest level.

Burner Core
===========

The foundation of a Burner Wallet is the Burner Core modules. These modules are UI-agnostic and only
handle blockchain calls.

BurnerCore
----------
The BurnerCore class (from the ``@burner-wallet/core`` package) routes all blockchain communications
between various modules. Burner Wallets are inheritly multi-chain applications, so this module must
route messages and transactions to the correct chain.

The BurnerCore class is also responsible for storing a log of historical on-chain events.

Gateways
--------

Gateways can be thought of as "wrapped RPC providers", as they transmit data from the wallet to
endpoints such as Infura.

The ``@burner-wallet/core`` module contains some standard gateways: InfuraGateway, XDaiGateway and
InjectedGateway (which transmits messages through an injected Web3 provider such as Metamask).

Theoretically, a gateway could also be used to connect to non-standard networks, such as a state
channel or centralized service.

Signers
-------

Signers maintain the "accounts" available to the wallet, and are responsible for cryptographically
signing transactions and messages.

The ``@burner-wallet/core`` module contains two standard signers: LocalSigner (which stores private
keys in the browser's LocalStorage) and InjectedSigner (which uses the account from an injected Web3
provider such as Metamask).

Signers can also provide more advanced functionality, such as the FortmaticSigner which uses the
Fortmatic service for signing, or the ContractWalletSigner, which generates counterfactual contract
wallets from other available accounts.

Assets
------

A standard interface is used for defining all fungible digital assets that are handled by the
wallet. Assets are responsible for sending assets, checking account balances and watching for
incoming transactions.

In addition to defining the abstract ``Asset`` class, the ``@burner-wallet/assets`` package contains
standard assets `eth`, `dai`, and `xdai`. Developers can easily define their own assets using the
classes ``NativeAsset`` (for assets such as ETH, xDai, testnet ETH) as well as ``ERC20Asset`` and
``ERC777Asset`` for tokens.


Burner Wallet UI
================

The Burner Wallet interface is defined using React Components.

UI Core
-------

Note: developers only need to farmiliarize themselves with the UI Core module if they want to
completely change the wallet interface. Most developers only need to use the Modern UI package.

The UI Core module is the root module of the Burner application. This module handles all URL routing,
all plugins, and routes data between the Burner Core instance and React components.

While the UI Core consists of a set of React components, it is design agnotstic. 

UI Implementations (ModernUI)
-----------------------------

Visual components are defined in a separate module. The ModernUI (``@burner-wallet/modern-ui``)
module should be sufficent for most applications, however developers may also use the ClassicUI
module (which resembes the original Austin Griffith Burner Wallet) or create their own UI
implementation.

Plugins
=======

Wallet functionality can be extended by defining plugins, which are Javascript packages that conform
to the Burner Wallet Package API.

At a simple level, plugins can access Web3 instances and insert React components into the wallet
interface. This allows plugins to provide any functionality that is possible in a standalone dapp.

Plugins also have the ability to extend other parts of the wallet, such as using the QR code
scanner, or providing human-readable names for addresses.

For more information, see the Plugin API section.

Exchange Plugin
---------------

The "burner-wallet-2" repository contains a number of offically-supported plugins, such as the
ENS Plugin or Recent Accounts Plugin. However, the Exchange Plugin plays an important role, as it
allows uses to convert between different asset types.

The Exchange Plugin itself is extendable by providing it a set of "Exchange Pairs", which define
mechanisms for converting from one asset to another. Two Exchange Pair classes are provided by
default: the Uniswap pair which allows converstion between any asset supported by Uniswap, and the
xDai Bridge which facilitates transfers between Dai and xDai.
