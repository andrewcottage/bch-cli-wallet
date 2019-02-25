/*
  Create wallet
*/

"use strict"

//const { expect, test } = require("@oclif/test")
const assert = require("chai").assert
const CreateWallet = require("../../src/commands/create-wallet")
const { bitboxMock } = require("../mocks/bitbox")
const BB = require("bitbox-sdk/lib/bitbox-sdk").default

// Inspect utility used for debugging.
const util = require("util")
util.inspect.defaultOptions = {
  showHidden: true,
  colors: true,
  depth: 1
}

// Set default environment variables for unit tests.
if (!process.env.TEST) process.env.TEST = "unit"

describe("create-wallet", () => {
  let BITBOX

  beforeEach(() => {
    // By default, use the mocking library instead of live calls.
    BITBOX = bitboxMock
  })

  it("should exit with error status if called without a filename.", async () => {
    try {
      const createWallet = new CreateWallet()
      await createWallet.createWallet(undefined, BITBOX, undefined)
    } catch (err) {
      //console.error(`Error expected: ${util.inspect(err)}`)

      assert.equal(
        err.message,
        "filename required.",
        "Should throw expected error."
      )
    }
  })

  it("should create a mainnet wallet file with the given name", async () => {
    // Use the real library if this is not a unit test.
    if (process.env.TEST !== "unit")
      BITBOX = new BB({ restURL: "https://rest.bitcoin.com/v1/" })

    const filename = `${__dirname}/../../wallets/test123.json`

    const createWallet = new CreateWallet()
    const walletData = await createWallet.createWallet(
      filename,
      BITBOX,
      undefined
    )

    assert.equal(walletData.network, "mainnet", "Expecting mainnet address")
    assert.hasAllKeys(walletData, [
      "network",
      "mnemonic",
      "balance",
      "nextAddress",
      "hasBalance",
      "rootAddress"
    ])

    // hasBalance is an array of objects. Each object represents an address with
    // a balance.
    assert.isArray(walletData.hasBalance)

    // For an integration test, ensure the rootAddress actually reflects mainnet.
    if (process.env.TEST !== "unit")
      assert.equal(walletData.rootAddress.indexOf("bitcoincash") > -1, true)
  })

  it("should create a mainnet wallet file when testnet is false", async () => {
    // Use the real library if this is not a unit test.
    if (process.env.TEST !== "unit")
      BITBOX = new BB({ restURL: "https://rest.bitcoin.com/v1/" })

    const filename = `${__dirname}/../../wallets/test123.json`

    const createWallet = new CreateWallet()
    const walletData = await createWallet.createWallet(filename, BITBOX, false)

    assert.equal(walletData.network, "mainnet", "Expecting mainnet address")
    assert.hasAllKeys(walletData, [
      "network",
      "mnemonic",
      "balance",
      "nextAddress",
      "hasBalance",
      "rootAddress"
    ])

    // hasBalance is an array of objects. Each object represents an address with
    // a balance.
    assert.isArray(walletData.hasBalance)

    // For an integration test, ensure the rootAddress actually reflects mainnet.
    if (process.env.TEST !== "unit")
      assert.equal(walletData.rootAddress.indexOf("bitcoincash") > -1, true)
  })

  it("should create a testnet wallet file with the given name", async () => {
    // Use the real library if this is not a unit test.
    if (process.env.TEST !== "unit")
      BITBOX = new BB({ restURL: "https://trest.bitcoin.com/v1/" })

    const filename = `${__dirname}/../../wallets/test123.json`

    const createWallet = new CreateWallet()
    const walletData = await createWallet.createWallet(
      filename,
      BITBOX,
      "testnet"
    )

    assert.equal(walletData.network, "testnet", "Expecting testnet address")
    assert.hasAllKeys(walletData, [
      "network",
      "mnemonic",
      "balance",
      "nextAddress",
      "hasBalance",
      "rootAddress"
    ])

    // hasBalance is an array of objects. Each object represents an address with
    // a balance.
    assert.isArray(walletData.hasBalance)

    // For an integration test, ensure the rootAddress actually reflects mainnet.
    if (process.env.TEST !== "unit")
      assert.equal(walletData.rootAddress.indexOf("bchtest") > -1, true)
  })
})
