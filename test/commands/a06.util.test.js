/*
  TODO:
*/

"use strict"

const assert = require("chai").assert
const appUtil = require("../../src/util")
const { bitboxMock } = require("../mocks/bitbox")
const BB = require("bitbox-sdk/lib/bitbox-sdk").default
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

describe("util", () => {
  let BITBOX
  let mockedWallet

  beforeEach(() => {
    // By default, use the mocking library instead of live calls.
    BITBOX = bitboxMock
    mockedWallet = Object.assign({}, testwallet) // Clone the testwallet
  })

  it("should throw error if wallet file not found.", async () => {
    try {
      await appUtil.openWallet("doesnotexist")
    } catch (err) {
      assert.include(err.message, `Could not open`, "Expected error message.")
    }
  })

  it("should get all UTXOs in wallet", async () => {
    // Use the real library if this is not a unit test.
    if (process.env.TEST !== "unit")
      BITBOX = new BB({ restURL: "https://trest.bitcoin.com/v1/" })

    const utxos = await appUtil.getUTXOs(mockedWallet, BITBOX)
    //console.log(`utxos: ${util.inspect(utxos)}`)

    assert.isArray(utxos, "Expect array of utxos")
    assert.hasAllKeys(utxos[0], [
      "txid",
      "vout",
      "amount",
      "satoshis",
      "height",
      "confirmations",
      "hdIndex"
    ])
  })
})
