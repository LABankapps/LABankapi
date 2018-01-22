let Web3 = require('web3');
const compiledContract = require('./LABankdapp');
const localhost = "http://localhost:8545";
const contractAddress = "0x37818182C09D5A80026cce573EB0da3F5b8b7042"; //returned after deploy
const nullAddress = "0x0000000000000000000000000000000000000000";
const web3 = new Web3(new Web3.providers.HttpProvider(localhost));
const Labank = new web3.eth.Contract(compiledContract.abi, contractAddress);

web3.eth.getCoinbase().then(function(coinbase){
  web3.eth.personal.unlockAccount(coinbase, "", function(err) {
    Labank.methods.insertUser(0).send({from :coinbase, gas: 1000000 }, function(err, transactionHash){
      if(err) console.log(err);
      else{
        console.log("hash : " + transactionHash); 
        Labank.methods.getLastUser().call({ from : ""}, function(err, uid){
          if(err) console.log(err);
          else{
            console.log("index " + uid);
            Labank.methods.getUser(uid-1).call({ from : ""}, function(err, address){
              if(err) console.log(err);
              else{
                console.log(address);
              }
            });
          }
        });
      }
    });
  });
});
