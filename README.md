bch-cli-wallet
========

This is an npm library and Bitcoin Cash (BCH) wallet that runs on the command
line. Add this library to your app to instantly give it the ability to transact
on the BCH network!

This project has the following goals:
- Create a code base for a wallet that is easily forkable and extensible by JavaScript developers.
- Explore the potential for bounty-tagged development

If you want a wallet with a graphical user interface, check out
[Badger Wallet](http://badger.bitcoin.com/). BCH functionality is
implemented in both wallets with [BITBOX](https://developer.bitcoin.com/bitbox), and the command
line interface for this project is built with [oclif](https://oclif.io).

Also, be sure to check out the design decisions and trade-offs that went into the
creation of this project in the [docs directory](./docs)

[![Build Status](https://travis-ci.org/christroutner/consolidating-coinjoin.svg?branch=master)](https://travis-ci.org/christroutner/consolidating-coinjoin)  [![Coverage Status](https://coveralls.io/repos/github/Bitcoin-com/bch-cli-wallet/badge.svg?branch=master)](https://coveralls.io/github/Bitcoin-com/bch-cli-wallet?branch=master) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

<!-- toc -->
* [NPM Usage](#npm-usage)
* [Command Line Usage](#command-line-usage)
* [Commands](#commands)
<!-- tocstop -->


# NPM Usage
The [npm library](https://www.npmjs.com/package/bch-cli-wallet) can be included
in your own app to instantly give it the ability to send and receive BCH transactions.
Here is an example of how to include it in your own app. This example will generate
a new HD wallet.

```javascript
// Instantiate the Create Wallet class from this library.
const CreateWallet = require('bch-cli-wallet/src/commands/create-wallet')
const createWallet = new CreateWallet()

const walletFile = './wallet.json'

async function makeNewWallet() {
  const wallet = await createWallet.createWallet(walletFile)

  console.log(`wallet: ${util.inspect(wallet)}`)
}
makeNewWallet()
```

# Command Line Usage
<!-- usage -->
```sh-session
$ npm install -g bch-cli-wallet
$ bch-cli-wallet COMMAND
running command...
$ bch-cli-wallet (-v|--version|version)
bch-cli-wallet/1.3.1 linux-x64 node-v10.15.1
$ bch-cli-wallet --help [COMMAND]
USAGE
  $ bch-cli-wallet COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`bch-cli-wallet create-wallet`](#bch-cli-wallet-create-wallet)
* [`bch-cli-wallet get-address`](#bch-cli-wallet-get-address)
* [`bch-cli-wallet hello`](#bch-cli-wallet-hello)
* [`bch-cli-wallet help [COMMAND]`](#bch-cli-wallet-help-command)
* [`bch-cli-wallet list-wallets`](#bch-cli-wallet-list-wallets)
* [`bch-cli-wallet remove-wallet`](#bch-cli-wallet-remove-wallet)
* [`bch-cli-wallet send`](#bch-cli-wallet-send)
* [`bch-cli-wallet send-all`](#bch-cli-wallet-send-all)
* [`bch-cli-wallet update-balances`](#bch-cli-wallet-update-balances)

## `bch-cli-wallet create-wallet`

Generate a new HD Wallet.

```
USAGE
  $ bch-cli-wallet create-wallet

OPTIONS
  -n, --name=name  Name of wallet
  -t, --testnet    Create a testnet wallet
```

_See code: [src/commands/create-wallet.js](https://github.com/Bitcoin-com/bch-cli-wallet/blob/v1.3.1/src/commands/create-wallet.js)_

## `bch-cli-wallet get-address`

Generate a new address to recieve BCH.

```
USAGE
  $ bch-cli-wallet get-address

OPTIONS
  -n, --name=name  Name of wallet
```

_See code: [src/commands/get-address.js](https://github.com/Bitcoin-com/bch-cli-wallet/blob/v1.3.1/src/commands/get-address.js)_

## `bch-cli-wallet hello`

Example command from oclif

```
USAGE
  $ bch-cli-wallet hello

OPTIONS
  -n, --name=name  name to print

DESCRIPTION
  ...
  Leaving it here for future reference in development.
```

_See code: [src/commands/hello.js](https://github.com/Bitcoin-com/bch-cli-wallet/blob/v1.3.1/src/commands/hello.js)_

## `bch-cli-wallet help [COMMAND]`

display help for bch-cli-wallet

```
USAGE
  $ bch-cli-wallet help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.1.6/src/commands/help.ts)_

## `bch-cli-wallet list-wallets`

List existing wallets.

```
USAGE
  $ bch-cli-wallet list-wallets
```

_See code: [src/commands/list-wallets.js](https://github.com/Bitcoin-com/bch-cli-wallet/blob/v1.3.1/src/commands/list-wallets.js)_

## `bch-cli-wallet remove-wallet`

Remove an existing wallet.

```
USAGE
  $ bch-cli-wallet remove-wallet

OPTIONS
  -n, --name=name  Name of wallet
```

_See code: [src/commands/remove-wallet.js](https://github.com/Bitcoin-com/bch-cli-wallet/blob/v1.3.1/src/commands/remove-wallet.js)_

## `bch-cli-wallet send`

Send an amount of BCH

```
USAGE
  $ bch-cli-wallet send

OPTIONS
  -a, --sendAddr=sendAddr  Cash address to send to
  -b, --bch=bch            Quantity in BCH
  -n, --name=name          Name of wallet
```

_See code: [src/commands/send.js](https://github.com/Bitcoin-com/bch-cli-wallet/blob/v1.3.1/src/commands/send.js)_

## `bch-cli-wallet send-all`

Send all BCH in a wallet to another address. **Degrades Privacy**

```
USAGE
  $ bch-cli-wallet send-all

OPTIONS
  -a, --sendAddr=sendAddr  Cash address to send to
  -n, --name=name          Name of wallet

DESCRIPTION
  Send all BCH in a wallet to another address. **Degrades Privacy**
  This method has a negative impact on privacy by linking all addresses in a
  wallet. If privacy of a concern, CoinJoin should be used.
  This is a good article describing the privacy concerns:
  https://bit.ly/2TnhdVc
```

_See code: [src/commands/send-all.js](https://github.com/Bitcoin-com/bch-cli-wallet/blob/v1.3.1/src/commands/send-all.js)_

## `bch-cli-wallet update-balances`

Poll the network and update the balances of the wallet.

```
USAGE
  $ bch-cli-wallet update-balances

OPTIONS
  -n, --name=name  Name of wallet
```

_See code: [src/commands/update-balances.js](https://github.com/Bitcoin-com/bch-cli-wallet/blob/v1.3.1/src/commands/update-balances.js)_
<!-- commandsstop -->
