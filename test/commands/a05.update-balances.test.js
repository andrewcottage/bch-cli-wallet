/*
  TODO:


*/

"use strict"

const assert = require("chai").assert
const sinon = require("sinon")

// File to be tested.
const UpdateBalances = require("../../src/commands/update-balances")

// Mock data
const testwallet = require("../mocks/testwallet.json")
const { bitboxMock } = require("../mocks/bitbox")
const updateBalancesMocks = require("../mocks/update-balances")

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

describe("#update-balances.js", () => {
  let mockedWallet
  const filename = `${__dirname}/../../wallets/test123.json`
  let updateBalances
  let sandbox

  beforeEach(() => {
    updateBalances = new UpdateBalances()

    // By default, use the mocking library instead of live calls.
    updateBalances.BITBOX = bitboxMock

    mockedWallet = Object.assign({}, testwallet) // Clone the testwallet

    sandbox = sinon.createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe("#generateAddresses", () => {
    it("should generate an address accurately.", async () => {
      updateBalances.BITBOX = new BB(REST_URL)

      const addr = updateBalances.generateAddress(mockedWallet, 3, 1)
      //console.log(`addr: ${util.inspect(addr)}`)

      assert.isArray(addr)
      assert.equal(addr.length, 1)
      assert.equal(
        addr[0],
        "bchtest:qq4sx72yfuhqryzm9h23zez27n6n24hdavvfqn2ma3"
      )
    })

    it("should generate the first 20 addresses", async () => {
      updateBalances.BITBOX = new BB(REST_URL)

      const addr = updateBalances.generateAddress(mockedWallet, 0, 20)
      //console.log(`addr: ${util.inspect(addr)}`)

      assert.isArray(addr)
      assert.equal(addr.length, 20)
      assert.equal(addr[0], mockedWallet.rootAddress)
    })
  })

  describe("#getAddressData", () => {
    it("should throw error if limit is over 20", async () => {
      try {
        await updateBalances.getAddressData(mockedWallet, 0, 40)

        assert.equal(true, false, "unexpected result!")
      } catch (err) {
        //console.log(`err: ${util.inspect(err)}`)
        assert.include(err.message, "limit must be 20 or less")
      }
    })

    it("should return an array of address data", async () => {
      updateBalances.BITBOX = new BB(REST_URL)

      // Use mocked data if this is a unit test.
      if (process.env.TEST === "unit") {
        sandbox
          .stub(updateBalances.BITBOX.Address, "details")
          .resolves(updateBalancesMocks.mockAddressDetails)
      }

      const result = await updateBalances.getAddressData(mockedWallet, 0, 2)
      //console.log(`result: ${util.inspect(result)}`)

      assert.isArray(result)
    })
  })

  describe("#update-balances", () => {
    it("should throw error if name is not supplied.", async () => {
      try {
        await updateBalances.validateFlags({})
      } catch (err) {
        assert.include(
          err.message,
          `You must specify a wallet with the -n flag`,
          "Expected error message."
        )
      }
    })
    /*


    it("should get balances for all addresses in wallet", async () => {
      // Use the real library if this is not a unit test.
      if (process.env.TEST !== "unit") updateBalances.BITBOX = new BB(REST_URL)

      const balances = await updateBalances.getAddressData(mockedWallet)
      //console.log(`balances: ${util.inspect(balances)}`)

      assert.isArray(balances, "Expect array of address balances")
      assert.equal(balances.length, mockedWallet.nextAddress)
    })

    it("generates a hasBalance array", async () => {
      // Retrieve mocked data.
      const addressData = bitboxMock.Address.details()

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

      const hasBalance = await updateBalances.generateHasBalance(addressData)

      const balanceTotal = await updateBalances.sumConfirmedBalances(hasBalance)
      //console.log(`balanceTotal: ${balanceTotal}`)

      assert.equal(balanceTotal, 0.09999752)
    })

    it("should update balances", async () => {
      // Use the real library if this is not a unit test.
      if (process.env.TEST !== "unit") updateBalances.BITBOX = new BB(REST_URL)

      const walletInfo = await updateBalances.updateBalances(
        filename,
        mockedWallet
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
*/
  })
})
