var Web3 = require('web3');
const compiledContract = require('../../contracts/LABankdapp');
const localhost = "http://localhost:8545";
var web3 = new Web3(new Web3.providers.HttpProvider(localhost));
var App = new web3.eth.Contract(compiledContract.abi);

var deployInstance = App.deploy({data: compiledContract.bytecode});

web3.eth.getCoinbase().then(function(coinbase){
  web3.eth.personal.unlockAccount(coinbase, "", function(err) {
    deployInstance.estimateGas(function(err, gas){
      console.log("coinbase " + coinbase);
      console.log("gasestimate " + gas);

      deployInstance.send({from: coinbase, gas: gas+4000}, function(error, transactionHash){})
        .on('transactionHash', function(hash){console.log("hash : " + hash); })
        .on('receipt', function (receipt) { console.log("Address: " + receipt.contractAddress); })
        .on('error', console.error);
    });
  });
}); 
