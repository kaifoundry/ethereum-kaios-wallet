import axios from "axios";

var HDKey = require("hdkey");
const bip39 = require("bip39");
const Web3 = require("web3");

let PROVIDER_LINK =
  "ETHEREUM_PROVIDER_KEY";

const web3 = new Web3(new Web3.providers.HttpProvider(PROVIDER_LINK));

async function createWalletFromMnemonic(index, mnemonic) {
  const seed = await bip39.mnemonicToSeed(mnemonic);
  const path = "m/44'/60'/0'/0/" + index.toString();
  console.log("Create New Wallet");

  // Second Package
  const wallet2 = HDKey.fromMasterSeed(seed).derive(path);
  let account = web3.eth.accounts.privateKeyToAccount(
    wallet2._privateKey.toString("hex")
  );
  return account;
}

async function importWalletFromMnemonic(index, mnemonic) {
  const seed = await bip39.mnemonicToSeed(mnemonic);
  const path = "m/44'/60'/0'/0/" + index.toString();

  // Second Package
  const wallet2 = HDKey.fromMasterSeed(seed).derive(path);
  let account = web3.eth.accounts.privateKeyToAccount(
    wallet2._privateKey.toString("hex")
  );
  return account;
}

async function importWalletfromPrivateKey(privateKey) {
  const wallet = await web3.eth.accounts.privateKeyToAccount(privateKey);
  return wallet;
}

async function generateMnemonic() {
  let mnemonic = await bip39.generateMnemonic();
  return mnemonic;
}

async function getBalance(address) {
  let balance = await web3.eth.getBalance(address);
  return balance;
}

// Create Transaction of ethereum
async function createTransaction(data) {
  // Create a transaction object with the required parameters

  const tnxObject = {
    from: data.From,
    to: data.To,
    value: web3.utils.toWei(data.Value, "ether"),
  };

  const txParams = {
    to: data.To, // recipient address
    value: web3.utils.toWei(data.Value, "ether"), // amount in wei
    gas: await web3.eth.estimateGas(tnxObject), // gas limit
    gasPrice: web3.utils.toWei("10", "gwei"), // gas price in wei
    nonce: await web3.eth.getTransactionCount(data.From), // transaction nonce
  };
  return txParams;
}

// Sign Transaction
async function signTransaction(txParams, privateKey) {
  const signedTx = await web3.eth.accounts.signTransaction(
    txParams,
    privateKey
  );
  return signedTx;
}

// Send Signed Transaction
async function sendSignedTransaction(signedTx) {
  const txReceipt = await web3.eth.sendSignedTransaction(
    signedTx.rawTransaction
  );
  return txReceipt;
}

// Get All Transactions
async function getAllTransactions(address) {
  let response = {};
  try {
    if (PROVIDER_LINK.includes("sepolia")) {
      response = await axios.get(
        `https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${address}&sort=desc`
      );
    } else if (PROVIDER_LINK.includes("goerli")) {
      response = await axios.get(
        `https://api-goerli.etherscan.io/api?module=account&action=txlist&address=${address}&sort=desc`
      );
    } else {
      response = await axios.get(
        `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&sort=desc`
      );
    }
    return response?.data?.result || [];
  } catch (error) {
    return response?.data?.result || [];
  }
}

// Get Specific Transaction Details
async function getTransactionDetails(txHash) {
  const transaction = await web3.eth.getTransaction(txHash);
  return transaction;
}


export {
  createWalletFromMnemonic,
  importWalletFromMnemonic,
  importWalletfromPrivateKey,
  generateMnemonic,
  getBalance,
  createTransaction,
  signTransaction,
  sendSignedTransaction,
  getAllTransactions,
  getTransactionDetails
};
