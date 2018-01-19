var Web3 = require('web3');
const compiledContractLABankdapp = require('./LABankdapp');
const compiledContractTest = require('./Test');
const localhost = "http://localhost:8545";
const LaBank = "0x22Dea6B8f848555dF328a4c909bF8bCD5a01b9A8";
const Test = "0x84C210471f7C58b547129E62cdDC2D365d307212";

var web3 = new Web3(new Web3.providers.HttpProvider(localhost));
var Contract = new web3.eth.Contract(compiledContractLABankdapp.abi, LaBank);

Contract.methods.getSender().call(function(err, result){
  if(err){
    console.log(err);
  }
  console.log(result);
});

// web3.eth.getCoinbase().then(function(coinbase){
//   web3.eth.personal.unlockAccount(coinbase, "", function(err, uares) {
//     Contract.methods.insertUser().send({from: coinbase, gas: 300000}, function(error, transactionHash){})
//     .on('transactionHash', function(hash){console.log("hash : " + hash); })
//     .on('error', console.error);
//   });
// });

// web3.eth.getCoinbase().then(function(coinbase){
//   web3.eth.personal.unlockAccount(coinbase, "", function(err, uares) {
//     Contract.methods.set().send({from: coinbase, gas: 300000}, function(error, transactionHash){})
//     .on('transactionHash', function(hash){console.log("hash : " + hash); })
//     .on('error', console.error);
//   });
// });
