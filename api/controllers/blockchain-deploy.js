const Web3 = require('web3');
const compiledContract = require('../../contracts/LABankdapp');
const localhost = "http://localhost:8545";
const web3 = new Web3(new Web3.providers.HttpProvider(localhost));
const Contract = web3.eth.contract(compiledContract.abi);
const coinbase = web3.eth.coinbase;
const gasEstimate = web3.eth.estimateGas({data: compiledContract.bytecode});

// deploy new contract
Contract.new({ data : compiledContract.bytecode, from: coinbase, gas: gasEstimate+10000 }, function(err, myContract){
  console.log("hash " + myContract.transactionHash);
  console.log("async " + myContract.address); // the contract address
});
