const express = require("express");
var str = process.cwd();
str = str + "/src/routes/Token.route";
const tokenRouter = require(str);
const basicAuth  = require("express-basic-auth");
const bodyParser = require("body-parser");
const cors = require("cors");
const util = require('util');
const zlib = require('zlib');
const contract = require("truffle-contract");

const CONFIG = require("../CONFIG");
const props = require("../CONFIG").getProps();

const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(props.rpc.host + ':' + props.rpc.port));
const {
  hexToBytes,
  toHex,
  bytesToHex,
  BN,
} = web3.utils;

const tokenContractJson = require("../../../truffle/build/contracts/Token.json");

const deflate = util.promisify(zlib.deflateRaw);
const inflate = util.promisify(zlib.inflateRaw);

const TokenContract = contract(tokenContractJson);
TokenContract.setProvider(web3.currentProvider);

let TokenContractInstance;

(async () => {
  const account = (await web3.eth.getAccounts())[0];
  console.log('account = '+account);
  TokenContract.defaults({
    from: account,
    gas: 999999,
    gasPrice: 0,
  });

  TokenContractInstance = await TokenContract.deployed();

  console.log('Connected to Token contract.');
})().catch(err => {
  console.error('Failed to connect to Token contract.');
  console.error(err);
});

const mint = async (tokenId, data, user) => {
  TokenContract.defaults({ from: CONFIG[user].address });

  let response;
  if (!data) {
    response = await TokenContractInstance.mint(tokenId);
  } else {
    let compressedData = JSON.stringify(data);

    compressedData = (await deflate(compressedData)).toString('hex');

    compressedData = hexToBytes('0x' + compressedData);

    response = await TokenContractInstance.mint(
      tokenId, compressedData
    );
  }

  return response;
};

exports.mint = mint;

const setData = async (tokenId, data, user) => {
  TokenContract.defaults({ from: CONFIG[user].address });

  let compressedData = JSON.stringify(data);

  compressedData = (await deflate(compressedData)).toString('hex');

  compressedData = hexToBytes('0x' + compressedData);

  let response = await TokenContractInstance.setData(
    tokenId, compressedData
  );

  return response;
}

exports.setData = setData;

const burn = async (tokenId, user) => {
  TokenContract.defaults({ from: CONFIG[user].address });

  const response = await TokenContractInstance.burn(tokenId);

  return response;
};

exports.burn = burn;

const getData = async (tokenId, user) => {
  TokenContract.defaults({ from: CONFIG[user].address });

  const response = await TokenContractInstance.getData(tokenId);

  if (response) {
    return JSON.parse(
      (await inflate(Buffer.from(response.slice(2), 'hex'))).toString()
    );
  } else {
    return null;
  };
};

exports.getData = getData;

const transfer = async (tokenId, toAddress, user) => {
  TokenContract.defaults({ from: CONFIG[user].address });

  const response = await TokenContractInstance.transfer(toAddress, tokenId);

  return response;
}

exports.transfer = transfer;

const tokensOwned = async (user) => {
  TokenContract.defaults({ from: CONFIG[user].address });

  const response = await TokenContractInstance.tokensOwned();

  if (!response) return null;

  let tokens = {};

  for (const tokenId of response.map(BN => BN.toNumber())) {
    tokens[tokenId] = await getData(tokenId, user);
  };

  return tokens;
}
exports.tokensOwned = tokensOwned;
