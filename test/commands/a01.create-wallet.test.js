/*
  Create wallet
*/

"use strict"

//const { expect, test } = require("@oclif/test")
const assert = require("chai").assert
const CreateWallet = require("../../src/commands/create-wallet")
const { bitboxMock } = require("../mocks/bitbox")

const BB = require("bitbox-sdk")
const REST_URL = { restURL: "https://trest.bitcoin.com/v2/" }

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
  let createWallet

  beforeEach(() => {
    createWallet = new CreateWallet()

    // By default, use the mocking library instead of live calls.
    createWallet.BITBOX = bitboxMock
  })

  it("should exit with error status if called without a filename.", async () => {
    try {
      await createWallet.createWallet(undefined, undefined)
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
    if (process.env.TEST !== "unit") createWallet.BITBOX = new BB(REST_URL)

    const filename = `${__dirname}/../../wallets/test123.json`

    const walletData = await createWallet.createWallet(filename, undefined)

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
    if (process.env.TEST !== "unit") createWallet.BITBOX = new BB(REST_URL)

    const filename = `${__dirname}/../../wallets/test123.json`

    const walletData = await createWallet.createWallet(filename, false)

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
    if (process.env.TEST !== "unit") createWallet.BITBOX = new BB(REST_URL)

    const filename = `${__dirname}/../../wallets/test123.json`

    const walletData = await createWallet.createWallet(filename, "testnet")

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
