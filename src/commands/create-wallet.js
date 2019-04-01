"use strict"

const appUtil = require("../util")

const BB = require("bitbox-sdk")
const BITBOX = new BB({ restURL: "https://rest.bitcoin.com/v2/" })

const { Command, flags } = require("@oclif/command")

//let _this

class CreateWallet extends Command {
  constructor(argv, config) {
    super(argv, config)
    //_this = this

    this.BITBOX = BITBOX
  }

  async run() {
    try {
      const { flags } = this.parse(CreateWallet)

      // Validate input flags
      this.validateFlags(flags)

      // Determine if this is a testnet wallet or a mainnet wallet.
      if (flags.testnet)
        this.BITBOX = new BB({ restURL: "https://trest.bitcoin.com/v2/" })

      const filename = `${__dirname}/../../wallets/${flags.name}.json`

      this.createWallet(filename, flags.testnet)
    } catch (err) {
      console.log(`Error: `, err)
    }
  }

  // testnet is a boolean.
  async createWallet(filename, testnet) {
    try {
      if (!filename || filename === "") throw new Error(`filename required.`)

      // Initialize the wallet data object that will be saved to a file.
      const walletData = {}
      if (testnet) walletData.network = "testnet"
      else walletData.network = "mainnet"

      // create 128 bit (12 word) BIP39 mnemonic
      const mnemonic = this.BITBOX.Mnemonic.generate(
        128,
        this.BITBOX.Mnemonic.wordLists().english
      )
      walletData.mnemonic = mnemonic

      // root seed buffer
      const rootSeed = this.BITBOX.Mnemonic.toSeed(mnemonic)

      // master HDNode
      if (testnet)
        var masterHDNode = this.BITBOX.HDNode.fromSeed(rootSeed, "testnet")
      else var masterHDNode = this.BITBOX.HDNode.fromSeed(rootSeed)

      // HDNode of BIP44 account
      const account = this.BITBOX.HDNode.derivePath(
        masterHDNode,
        "m/44'/145'/0'"
      )

      // derive the first external change address HDNode which is going to spend utxo
      const change = this.BITBOX.HDNode.derivePath(account, "0/0")

      // get the cash address
      walletData.rootAddress = this.BITBOX.HDNode.toCashAddress(change)

      // Initialize other data.
      walletData.balance = 0
      walletData.nextAddress = 1
      walletData.hasBalance = []

      // Write out the basic information into a json file for other apps to use.
      //const filename = `${__dirname}/../../wallets/${name}.json`
      await appUtil.saveWallet(filename, walletData)

      return walletData
    } catch (err) {
      if (err.code !== "EEXIT") console.log(`Error in createWallet().`)
      throw err
    }
  }

  // Validate the proper flags are passed in.
  validateFlags(flags) {
    // Exit if wallet not specified.
    const name = flags.name
    if (!name || name === "")
      throw new Error(`You must specify a wallet with the -n flag.`)

    return true
  }
}

CreateWallet.description = `Generate a new HD Wallet.`

CreateWallet.flags = {
  testnet: flags.boolean({ char: "t", description: "Create a testnet wallet" }),
  name: flags.string({ char: "n", description: "Name of wallet" })
}

module.exports = CreateWallet
