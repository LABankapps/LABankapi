const Web3 = require('web3');
const compiledContract = require('./LABankdapp');
const contractAddress = "0xcc08a260b9bf4887c959f2eec6dc20286325a1c3"; //returned after deploy
const nullAddress = "0x0000000000000000000000000000000000000000";
const localhost = "http://localhost:8545";
const web3 = new Web3(new Web3.providers.HttpProvider(localhost));
const Contract = web3.eth.contract(compiledContract.abi);
const Labank = Contract.at(contractAddress); // instantiate by address
const coinbase = web3.eth.coinbase; //get eth.defaultAccount (synchronously)

var str = web3.toHex("test");
Labank.setGreeter(str, { from: coinbase, gas: 1000000 }, function(err, transactionHash){
  if(err) console.log(err);
  else console.log("transaction : " + transactionHash);
});