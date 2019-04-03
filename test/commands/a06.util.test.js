/*
  TODO:
*/

"use strict"

const assert = require("chai").assert
const sinon = require("sinon")

// File under test.
const AppUtils = require("../../src/util")

const BB = require("bitbox-sdk")
const REST_URL = { restURL: "https://trest.bitcoin.com/v2/" }

// Mocking data
const { bitboxMock } = require("../mocks/bitbox")
const testwallet = require("../mocks/testwallet.json")
const utilMocks = require("../mocks/util")

// Inspect utility used for debugging.
const util = require("util")
util.inspect.defaultOptions = {
  showHidden: true,
  colors: true,
  depth: 1
}

// Set default environment variables for unit tests.
if (!process.env.TEST) process.env.TEST = "unit"

describe("#util.js", () => {
  let BITBOX
  let mockedWallet
  let appUtils
  let sandbox

  beforeEach(() => {
    // By default, use the mocking library instead of live calls.
    BITBOX = bitboxMock
    mockedWallet = Object.assign({}, testwallet) // Clone the testwallet

    appUtils = new AppUtils()
    appUtils.BITBOX = BITBOX

    sandbox = sinon.createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe("#getUTXOs", () => {
    it("should get all UTXOs in wallet", async () => {
      // Use the real library if this is not a unit test.
      //if (process.env.TEST !== "unit") appUtils.BITBOX = new BB(REST_URL)
      appUtils.BITBOX = new BB(REST_URL)

      if (process.env.TEST === "unit") {
        sandbox
          .stub(appUtils.BITBOX.Address, "utxo")
          .resolves(utilMocks.mockUtxo)
      }

      const utxos = await appUtils.getUTXOs(mockedWallet)
      //console.log(`utxos: ${util.inspect(utxos)}`)

      assert.isArray(utxos, "Expect array of utxos")
      if (utxos.length > 0) {
        assert.hasAllKeys(utxos[0], [
          "txid",
          "vout",
          "amount",
          "satoshis",
          "height",
          "confirmations",
          "hdIndex"
        ])
      }
    })
  })

  describe("#openWallet", () => {
    it("should throw error if wallet file not found.", () => {
      try {
        appUtils.openWallet("doesnotexist")
      } catch (err) {
        assert.include(err.message, `Could not open`, "Expected error message.")
      }
    })
  })

  describe("#saveWallet", () => {
    it("should save a wallet without error", async () => {
      const filename = `${__dirname}/../../wallets/test123.json`

      await appUtils.saveWallet(filename, mockedWallet)
    })
  })

  describe("#changeAddrFromMnemonic", () => {
    it("should return a change address", () => {
      appUtils.BITBOX = new BB(REST_URL)

      const result = appUtils.changeAddrFromMnemonic(mockedWallet, 0)
      //console.log(`result: ${util.inspect(result)}`)
      //console.log(`result: ${JSON.stringify(result, null, 2)}`)

      assert.hasAnyKeys(result, ["keyPair", "chainCode", "index"])
    })
  })
})
