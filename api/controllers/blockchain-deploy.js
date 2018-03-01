const Web3 = require('web3');
const compiledContract = require('../../contracts/LABankdapp');
const localhost = "http://localhost:8545";
const web3 = new Web3(new Web3.providers.HttpProvider(localhost));
const Contract = web3.eth.contract(compiledContract.abi);
const coinbase = web3.eth.coinbase;
const gasEstimate = web3.eth.estimateGas({data: compiledContract.bytecode});

function waitToBeMined(txnHash, callback){
  var transactionReceiptAsync;
  var interval = 500;
  var timeout = 10000;
  transactionReceiptAsync = function(txnHash) {
    console.log("pending transaction...");
    var receipt = web3.eth.getTransactionReceipt(txnHash);
    console.log(receipt);
    if (receipt == null) {
      if(timeout <= timeout) return callback(false, "Mining timeout exceeded (10s) Miners may be not mining");
      else{
        setTimeout(function () {
          timeout -= interval;
          transactionReceiptAsync(txnHash);
        }, interval);
      }
    } else {
      return callback(true, address);
    }
  };
  transactionReceiptAsync(txnHash);
}

Contract.new({ data : compiledContract.bytecode, from: coinbase, gas: gasEstimate+10000 }, function(err, myContract){
  if(err) console.log(err);
  console.log("transcation to be mined : " + myContract);
  console.log("transcation to be mined : " + myContract);
  // waitToBeMined(myContract.transactionHash, function(address){
  //   console.log("transcation mined at address : " + address);
  // });
});
