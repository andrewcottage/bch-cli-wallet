/*
  Generates a new HD address for recieving BCH.

  -The next available address is tracked by the 'nextAddress' property in the
  wallet .json file.

  TODO:
  -Add BIP44 support
*/

"use strict"

const qrcode = require("qrcode-terminal")

const AppUtils = require("../util")
const appUtils = new AppUtils()

const BB = require("bitbox-sdk")
const BITBOX = new BB({ restURL: "https://rest.bitcoin.com/v2/" })

const { Command, flags } = require("@oclif/command")

//let _this

class GetAddress extends Command {
  constructor(argv, config) {
    super(argv, config)

    this.BITBOX = BITBOX
  }

  async run() {
    try {
      const { flags } = this.parse(GetAddress)

      // Validate input flags
      this.validateFlags(flags)

      // Determine if this is a testnet wallet or a mainnet wallet.
      if (flags.testnet)
        this.BITBOX = new BB({ restURL: "https://trest.bitcoin.com/v2/" })

      // Generate an absolute filename from the name.
      const filename = `${__dirname}/../../wallets/${flags.name}.json`

      const newAddress = await this.getAddress(filename)

      // Display the address as a QR code.
      qrcode.generate(newAddress, { small: true })

      // Display the address to the user.
      this.log(`${newAddress}`)
      //this.log(`legacy address: ${legacy}`)
    } catch (err) {
      if (err.message) console.log(err.message)
      else console.log(`Error in GetAddress.run: `, err)
    }
  }

  async getAddress(filename) {
    //const filename = `${__dirname}/../../wallets/${name}.json`
    const walletInfo = appUtils.openWallet(filename)
    //console.log(`walletInfo: ${JSON.stringify(walletInfo, null, 2)}`)

    // root seed buffer
    const rootSeed = this.BITBOX.Mnemonic.toSeed(walletInfo.mnemonic)

    // master HDNode
    if (walletInfo.network === "testnet")
      var masterHDNode = this.BITBOX.HDNode.fromSeed(rootSeed, "testnet")
    else var masterHDNode = this.BITBOX.HDNode.fromSeed(rootSeed)

    // HDNode of BIP44 account
    const account = this.BITBOX.HDNode.derivePath(masterHDNode, "m/44'/145'/0'")

    // derive an external change address HDNode
    const change = this.BITBOX.HDNode.derivePath(
      account,
      `0/${walletInfo.nextAddress}`
    )

    // Increment to point to a new address for next time.
    walletInfo.nextAddress++

    // Update the wallet file.
    await appUtils.saveWallet(filename, walletInfo)

    // get the cash address
    const newAddress = this.BITBOX.HDNode.toCashAddress(change)
    //const legacy = BITBOX.HDNode.toLegacyAddress(change)

    return newAddress
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

GetAddress.description = `Generate a new address to recieve BCH.`

GetAddress.flags = {
  name: flags.string({ char: "n", description: "Name of wallet" })
}

module.exports = GetAddress
