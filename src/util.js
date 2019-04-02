/*
  Utility Library.
  Common functions used by several commands.

  TODO:

*/

"use strict"

const fs = require("fs")

// Inspect utility used for debugging.
const util = require("util")
util.inspect.defaultOptions = {
  showHidden: true,
  colors: true,
  depth: 1
}

const BB = require("bitbox-sdk")
const BITBOX = new BB({ restURL: "https://rest.bitcoin.com/v2/" })

class AppUtils {
  constructor() {
    this.BITBOX = BITBOX
  }

  // Returns an array of UTXO objects. These objects contain the metadata needed
  // to optimize the selection of a UTXO for spending.
  async getUTXOs(walletInfo) {
    try {
      const retArray = []

      // Loop through each address that has a balance.
      for (var i = 0; i < walletInfo.hasBalance.length; i++) {
        const thisAddr = walletInfo.hasBalance[i].cashAddress

        // Get the UTXOs for that address.
        const u = await this.BITBOX.Address.utxo(thisAddr)
        //console.log(`u for ${thisAddr}: ${JSON.stringify(u, null, 2)}`)
        const utxos = u.utxos
        //console.log(`utxos for ${thisAddr}: ${util.inspect(utxos)}`)

        // Loop through each UXTO returned
        for (var j = 0; j < utxos.length; j++) {
          const thisUTXO = utxos[j]
          //console.log(`thisUTXO: ${util.inspect(thisUTXO)}`)

          // Add the HD node index to the UTXO for use later.
          thisUTXO.hdIndex = walletInfo.hasBalance[i].index

          // Add the UTXO to the array if it has at least one confirmation.
          if (thisUTXO.confirmations > 0) retArray.push(thisUTXO)
        }
      }

      return retArray
    } catch (err) {
      console.log(`Error in getUTXOs.`, err)
      throw err
    }
  }
}

module.exports = {
  saveWallet,
  openWallet,
  changeAddrFromMnemonic, // Used for signing transactions.
  AppUtils
}

// Save a wallet to a file.
function saveWallet(filename, walletData) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filename, JSON.stringify(walletData, null, 2), function(err) {
      if (err) return reject(console.error(err))

      //console.log(`${name}.json written successfully.`)
      return resolve()
    })
  })
}

// Open a wallet by file name.
function openWallet(filename) {
  try {
    // Delete the cached copy of the wallet. This allows testing of list-wallets.
    delete require.cache[require.resolve(filename)]

    const walletInfo = require(filename)
    return walletInfo
  } catch (err) {
    throw new Error(`Could not open ${filename}`)
  }
}

// Generate a change address from a Mnemonic of a private key.
function changeAddrFromMnemonic(walletInfo, index, BITBOX) {
  // root seed buffer
  const rootSeed = BITBOX.Mnemonic.toSeed(walletInfo.mnemonic)

  // master HDNode
  if (walletInfo.network === "testnet")
    var masterHDNode = BITBOX.HDNode.fromSeed(rootSeed, "testnet")
  else var masterHDNode = BITBOX.HDNode.fromSeed(rootSeed)

  // HDNode of BIP44 account
  const account = BITBOX.HDNode.derivePath(masterHDNode, "m/44'/145'/0'")

  // derive the first external change address HDNode which is going to spend utxo
  const change = BITBOX.HDNode.derivePath(account, `0/${index}`)

  return change
}
