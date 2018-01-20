var Web3 = require('web3');
const compiledContract = require('./LABankdapp');
const localhost = "http://localhost:8545";
const contractAddress = "0xd788a45013Cc5054cDdEe4a643efB09920BCa1A6"; //returned after deploy
var web3 = new Web3(new Web3.providers.HttpProvider(localhost));
var Contract = new web3.eth.Contract(compiledContract.abi, contractAddress);

web3.utils.isAddress(contractAddress);

// web3.eth.getCoinbase().then(function(coinbase){
//   web3.eth.personal.unlockAccount(coinbase, "").then(function(result){
//     Contract.methods.insertUser().send({ from : coinbase, gas:30000 }, function(error, transactionHash){})
//       .on('transactionHash', function(hash){console.log("hash : " + hash); })
//       .on('receipt', function (receipt) { console.log("Address: " + receipt); })
//       .on('error', console.error);
//   });
// });

Contract.methods.getUser(0).call({from : ""}, function(err, result){
  if(err) console.log(err);
  console.log(result);
});
