/*
  TODO:
*/

"use strict"

const assert = require("chai").assert
const sinon = require("sinon")

// File under test.
const appUtil = require("../../src/util")

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

    appUtils = new appUtil.AppUtils()
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
    it("should throw error if wallet file not found.", async () => {
      try {
        await appUtils.openWallet("doesnotexist")
      } catch (err) {
        assert.include(err.message, `Could not open`, "Expected error message.")
      }
    })
  })
})
