/*
  Contains mock data used in unit tests for the update-balances.js command.
*/

"use strict"

const mockAddressDetails = [
  {
    balance: 0,
    balanceSat: 0,
    totalReceived: 0,
    totalReceivedSat: 0,
    totalSent: 0,
    totalSentSat: 0,
    unconfirmedBalance: 0,
    unconfirmedBalanceSat: 0,
    unconfirmedTxApperances: 0,
    txApperances: 0,
    transactions: [],
    legacyAddress: "mv9wPCHx2iCdbXBkJ1UTAZCAq57PCL2YQ9",
    cashAddress: "bchtest:qzsfqeqtdk6plsvglccadkqtf0trf2nyz58090e6tt",
    currentPage: 0,
    pagesTotal: 0
  },
  {
    balance: 0,
    balanceSat: 0,
    totalReceived: 0.1,
    totalReceivedSat: 10000000,
    totalSent: 0.1,
    totalSentSat: 10000000,
    unconfirmedBalance: 0,
    unconfirmedBalanceSat: 0,
    unconfirmedTxApperances: 0,
    txApperances: 2,
    transactions: [],
    legacyAddress: "n3A9BmjrEG3ubJeoAJGwjkymhmqZhGbZR2",
    cashAddress: "bchtest:qrkkx8au5lxsu2hka2c4ecn3juxjpcuz05wh08hhl2",
    currentPage: 0,
    pagesTotal: 1
  }
]

const updateBalancesMocks = {
  mockAddressDetails
}

module.exports = updateBalancesMocks
