require('dotenv').config()
const HDWalletProvider = require('truffle-hdwallet-provider')
const fs = require('fs')
const EthWallet = require('ethereumjs-wallet')
const WalletProvider = require('truffle-wallet-provider')

const {
  WALLET_PROVIDER_METHOD,
  CREDENTIALS_KEYSTORE,
  CREDENTIALS_PASSWORD,
  MNEMONIC
} = process.env

let walletProvider
if (WALLET_PROVIDER_METHOD === 'keystore') {
  const keystore = fs.readFileSync(CREDENTIALS_KEYSTORE).toString()
  const password = fs.readFileSync(CREDENTIALS_PASSWORD).toString().trim()
  const wallet = EthWallet.fromV3(keystore, password)
  walletProvider = new WalletProvider(wallet, 'http://127.0.0.1:8545')
  console.log(`Wallet address ${wallet.getAddressString()}`)
} else if (WALLET_PROVIDER_METHOD === 'mnemonic') {
  walletProvider = new HDWalletProvider(MNEMONIC, 'http://127.0.0.1:8545')
  console.log(`Wallet address ${walletProvider.addresses[0]}`)
} else {
  console.log(`No wallet provider found...`)
}

module.exports = {
  networks: {
    ganache: {
      host: 'localhost',
      port: 8545,
      network_id: '*', // eslint-disable-line camelcase
      gasPrice: 1000000000,
      gas: 4600000
    },
    fuse_pos: {
      provider: walletProvider,
      network_id: '*',
      gasPrice: 1000000000,
      gas: 4600000
    }
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  },
  mocha: {
    reporter: 'eth-gas-reporter',
    reporterOptions : {
      currency: 'USD',
      gasPrice: 1
    }
  }
}
