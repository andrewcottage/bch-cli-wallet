/*
  TODO:


*/

"use strict"

const assert = require("chai").assert
const Send = require("../../src/commands/send")
const { bitboxMock } = require("../mocks/bitbox")
const BB = require("bitbox-sdk")
const testwallet = require("../mocks/testwallet.json")

// Inspect utility used for debugging.
const util = require("util")
util.inspect.defaultOptions = {
  showHidden: true,
  colors: true,
  depth: 1
}

// Set default environment variables for unit tests.
if (!process.env.TEST) process.env.TEST = "unit"

describe("send", () => {
  let BITBOX
  let mockedWallet

  beforeEach(() => {
    // By default, use the mocking library instead of live calls.
    BITBOX = bitboxMock
    mockedWallet = Object.assign({}, testwallet) // Clone the testwallet
  })

  it("should throw error if name is not supplied.", () => {
    try {
      const send = new Send()
      send.validateFlags({})
    } catch (err) {
      assert.include(
        err.message,
        `You must specify a wallet with the -n flag`,
        "Expected error message."
      )
    }
  })

  it("should throw error if BCH quantity is not supplied.", () => {
    try {
      const flags = {
        name: `testwallet`
      }

      const send = new Send()
      send.validateFlags(flags)
    } catch (err) {
      assert.include(
        err.message,
        `You must specify a quantity in BCH with the -b flag.`,
        "Expected error message."
      )
    }
  })

  it("should throw error if recieving address is not supplied.", () => {
    try {
      const flags = {
        name: `testwallet`,
        bch: 0.000005
      }

      const send = new Send()
      send.validateFlags(flags)
    } catch (err) {
      assert.include(
        err.message,
        `You must specify a send-to address with the -a flag.`,
        "Expected error message."
      )
    }
  })

  it("should return true if all flags are supplied.", () => {
    const flags = {
      name: `testwallet`,
      bch: 0.000005,
      sendAddr: `abc`
    }

    const send = new Send()
    const result = send.validateFlags(flags)

    assert.equal(result, true)
  })

  it("should select a single UTXO", async () => {
    const bch = 0.0001
    const utxos = bitboxMock.Address.utxo()

    const send = new Send()
    const utxo = await send.selectUTXO(bch, utxos.utxos, BITBOX)
    //console.log(`utxo: ${util.inspect(utxo)}`)

    assert.isObject(utxo, "Expect single utxo object")
    assert.hasAllKeys(utxo, [
      "txid",
      "vout",
      "amount",
      "satoshis",
      "height",
      "confirmations",
      "hdIndex"
    ])

    // Since this test uses mocked data, the values are known ahead of time.
    assert.equal(utxo.amount, 0.00079504)
  })

  it("should send BCH on testnet", async () => {
    const bch = 0.000005 // BCH to send in an integration test.
    const utxo = {
      txid: "26564508facb32a5f6893cb7bdfd2dcc264b248a1aa7dd0a572117667418ae5b",
      vout: 0,
      scriptPubKey: "76a9148687a941392d82bf0af208779c3b147e2fbadafa88ac",
      amount: 0.03,
      satoshis: 3000000,
      height: 1265272,
      confirmations: 733,
      legacyAddress: "mjSPWfCwCgHZC27nS8GQ4AXz9ehhb2GFqz",
      cashAddress: "bchtest:qq4sx72yfuhqryzm9h23zez27n6n24hdavvfqn2ma3"
    }
    const sendToAddr = `bchtest:qzsfqeqtdk6plsvglccadkqtf0trf2nyz58090e6tt`

    const send = new Send()
    const txid = await send.sendBCH(
      utxo,
      bch,
      utxo.changeAddress,
      sendToAddr,
      testwallet,
      BITBOX
    )

    assert.equal(txid, `mockTXID`)
  })

  it("should send BCH on mainnet", async () => {
    const bch = 0.000005 // BCH to send in an integration test.
    const utxo = {
      txid: "26564508facb32a5f6893cb7bdfd2dcc264b248a1aa7dd0a572117667418ae5b",
      vout: 0,
      scriptPubKey: "76a9148687a941392d82bf0af208779c3b147e2fbadafa88ac",
      amount: 0.03,
      satoshis: 3000000,
      height: 1265272,
      confirmations: 733,
      legacyAddress: "mjSPWfCwCgHZC27nS8GQ4AXz9ehhb2GFqz",
      cashAddress: "bchtest:qq4sx72yfuhqryzm9h23zez27n6n24hdavvfqn2ma3"
    }
    const sendToAddr = `bchtest:qzsfqeqtdk6plsvglccadkqtf0trf2nyz58090e6tt`

    // Switch to mainnet
    mockedWallet.network = "mainnet"

    const send = new Send()
    const txid = await send.sendBCH(
      utxo,
      bch,
      utxo.changeAddress,
      sendToAddr,
      mockedWallet,
      BITBOX
    )

    assert.equal(txid, `mockTXID`)
  })
})
