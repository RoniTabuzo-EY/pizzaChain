const contract = require("truffle-contract");
const Web3 = require("web3");
const pizzaContractJson = require("../../../truffle/build/contracts/PizzaCoin.json");

const web3 = new Web3(new Web3.providers.HttpProvider(process.env.WEB3_PROVIDER));

const PizzaCoinContract = contract(pizzaContractJson);
PizzaCoinContract.setProvider(web3.currentProvider);

const accountNumber = process.env.ACCOUNT_NUMBER || 0;

// mint happens when Pizzaco issues a Purchase Order; the total tokens required to satisfy that order is minted
export const mint = async (amount) => {
  const account = (await web3.eth.getAccounts())[accountNumber];
  const PCContractInstance = await PizzaCoinContract.deployed();
  let response = await PCContractInstance.mint(amount, { from: account });
  
  return response;
};

export const transfer = async (receiver, amount) => {
  const account = (await web3.eth.getAccounts())[accountNumber];
  const PCContractInstance = await PizzaCoinContract.deployed();
  let response = await PCContractInstance.transfer(receiver, amount, { from: account });
  return response;  
}

export const getBalance = async (account) => {
  const PCContractInstance = await PizzaCoinContract.deployed();
  let response = await PCContractInstance.balanceOf(account).call({ from: account });
  return response;  
}

export const burn = async (tokenId) => {
  const account = (await web3.eth.getAccounts())[accountNumber];
  const PCContractInstance = await PizzaCoinContract.deployed();

  const response = await PCContractInstance.burn(tokenId, { from: account });

  return response;
};