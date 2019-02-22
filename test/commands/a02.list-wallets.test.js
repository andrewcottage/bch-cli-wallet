"use strict"

//const { expect, test } = require("@oclif/test")
const assert = require("chai").assert
const CreateWallet = require("../../src/commands/create-wallet")
const ListWallets = require("../../src/commands/list-wallets")
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

describe("list-wallets", () => {
  let BITBOX

  beforeEach(() => {
    // By default, use the mocking library instead of live calls.
    BITBOX = bitboxMock
  })

  it("should correctly identify a mainnet wallet", async () => {
    // Use the real library if this is not a unit test.
    if (process.env.TEST !== "unit")
      BITBOX = new BB({ restURL: "https://rest.bitcoin.com/v1/" })

    const filename = `${__dirname}/../../wallets/test123.json`

    // Create a mainnet wallet.
    const createWallet = new CreateWallet()
    await createWallet.createWallet(filename, BITBOX, false)

    const listWallets = new ListWallets()
    const data = listWallets.parseWallets()

    // Find the wallet that was just created.
    const testWallet = data.find(wallet => wallet[0].indexOf("test123") > -1)

    const network = testWallet[1]
    const balance = testWallet[2]
    assert.equal(network, "mainnet", "Correct network detected.")
    assert.equal(balance, 0, "Should have a zero balance")
  })

  it("should correctly identify a testnet wallet", async () => {
    // Use the real library if this is not a unit test
    if (process.env.TEST !== "unit")
      BITBOX = new BB({ restURL: "https://trest.bitcoin.com/v1/" })

    const filename = `${__dirname}/../../wallets/test123.json`

    // Create a testnet wallet
    const createWallet = new CreateWallet()
    await createWallet.createWallet(filename, BITBOX, "testnet")

    const listWallets = new ListWallets()
    const data = listWallets.parseWallets()
    //console.log(`data: ${util.inspect(data)}`)

    // Find the wallet that was just created.
    const testWallet = data.find(wallet => wallet[0].indexOf("test123") > -1)
    //console.log(`testWallet: ${util.inspect(testWallet)}`)

    const network = testWallet[1]
    const balance = testWallet[2]
    assert.equal(network, "testnet", "Correct network detected.")
    assert.equal(balance, 0, "Should have a zero balance")
  })
})
