/*
  TODO:


*/

"use strict"

const assert = require("chai").assert
const UpdateBalances = require("../../src/commands/update-balances")
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

describe("update-balances", () => {
  let BITBOX
  let mockedWallet
  const filename = `${__dirname}/../../wallets/test123.json`

  beforeEach(() => {
    // By default, use the mocking library instead of live calls.
    BITBOX = bitboxMock
    mockedWallet = Object.assign({}, testwallet) // Clone the testwallet
  })

  it("should throw error if name is not supplied.", async () => {
    try {
      const updateBalances = new UpdateBalances()
      await updateBalances.validateFlags({})
    } catch (err) {
      assert.include(
        err.message,
        `You must specify a wallet with the -n flag`,
        "Expected error message."
      )
    }
  })

  it("should generate an address accurately.", async () => {
    BITBOX = new BB({})

    const updateBalances = new UpdateBalances()
    const addr = updateBalances.generateAddress(mockedWallet, 3, BITBOX)

    assert.equal(addr, "bchtest:qq4sx72yfuhqryzm9h23zez27n6n24hdavvfqn2ma3")
  })

  it("should get balances for all addresses in wallet", async () => {
    // Use the real library if this is not a unit test.
    if (process.env.TEST !== "unit")
      BITBOX = new BB({ restURL: "https://trest.bitcoin.com/v1/" })

    const updateBalances = new UpdateBalances()
    const balances = await updateBalances.getAddressData(mockedWallet, BITBOX)
    //console.log(`balances: ${util.inspect(balances)}`)

    assert.isArray(balances, "Expect array of address balances")
    assert.equal(balances.length, mockedWallet.nextAddress)
  })

  it("generates a hasBalance array", async () => {
    // Retrieve mocked data.
    const addressData = bitboxMock.Address.details()

    const updateBalances = new UpdateBalances()
    const hasBalance = await updateBalances.generateHasBalance(addressData)
    //console.log(`hasBalance: ${util.inspect(hasBalance)}`)

    assert.isArray(hasBalance, "Expect array of addresses with balances.")
    assert.hasAllKeys(hasBalance[0], [
      "index",
      "balance",
      "balanceSat",
      "unconfirmedBalance",
      "unconfirmedBalanceSat",
      "cashAddress"
    ])
  })

  it("should aggregate balances", async () => {
    // Retrieve mocked data
    const addressData = bitboxMock.Address.details()
    const updateBalances = new UpdateBalances()
    const hasBalance = await updateBalances.generateHasBalance(addressData)

    const balanceTotal = await updateBalances.sumConfirmedBalances(hasBalance)
    //console.log(`balanceTotal: ${balanceTotal}`)

    assert.equal(balanceTotal, 0.09999752)
  })

  it("should update balances", async () => {
    // Use the real library if this is not a unit test.
    if (process.env.TEST !== "unit")
      BITBOX = new BB({ restURL: "https://trest.bitcoin.com/v1/" })

    const updateBalances = new UpdateBalances()
    const walletInfo = await updateBalances.updateBalances(
      filename,
      mockedWallet,
      BITBOX
    )
    //console.log(`walletInfo: ${JSON.stringify(walletInfo, null, 2)}`)

    assert.hasAllKeys(walletInfo, [
      "network",
      "mnemonic",
      "balance",
      "balanceConfirmed",
      "balanceUnconfirmed",
      "nextAddress",
      "hasBalance",
      "rootAddress",
      "name"
    ])

    assert.isArray(
      walletInfo.hasBalance,
      "Expect array of addresses with balances."
    )
  })
})
