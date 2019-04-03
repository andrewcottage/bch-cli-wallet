/*
  Contains mock data for the util.js library.
*/

"use strict"

const mockUtxo = {
  utxos: [
    {
      txid: "fc2d806e1395e6fbc57f1dbedbd6e04794e2105d1c8915c49539b5041b12345c",
      vout: 1,
      amount: 0.1,
      satoshis: 10000000,
      height: 1296652,
      confirmations: 1
    }
  ],
  legacyAddress: "msnHMfK2pwaBWdE7a7y4f7atdzYahRM7t8",
  cashAddress: "bchtest:qzrg022p8ykc90c27gy808pmz3lzlwk6lg77y3h8fm",
  scriptPubKey: "76a9148687a941392d82bf0af208779c3b147e2fbadafa88ac"
}

const utilMockData = {
  mockUtxo
}

module.exports = utilMockData
