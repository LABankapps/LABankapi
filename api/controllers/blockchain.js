const Web3 = require('web3');
const compiledContract = require('../../contracts/LABankdapp');
const contractAddress = "0xcc08a260b9bf4887c959f2eec6dc20286325a1c3"; //returned after deploy
const nullAddress = "0x0000000000000000000000000000000000000000";
const localhost = "http://localhost:8545";
const web3 = new Web3(new Web3.providers.HttpProvider(localhost));
const Contract = web3.eth.contract(compiledContract.abi);
const initialAmount = 100;
const Labank = Contract.at(contractAddress); // instantiate by address
const coinbase = web3.eth.coinbase; //get eth.defaultAccount (synchronously)

exports.getSkills = function(req,res,next){
  if(!req.params.address) return res.status(422).json({ "error" : "Adresse manquante."});
  if(!web3.isAddress(req.params.address) || req.params.address === nullAddress ) return res.status(422).json({ "error" : "Adresse invalide." });
  else{
    var result = Labank.getSkills(req.params.address);
    var array = [];
    if(!Array.isArray(result)) return res.status(300).json({ "error" : "Compétences doivent être un tableau." });
    else{
      for(let skill of result){
        array.push({ name : web3.toAscii(skill).replace(/\0/g, '') });
      }
      return res.status(200).json({ skills : array });
    }
  }
};

exports.getBalance = function getBalance(address){
  if(!address) return res.status(422).json({ "error" : "Adresse manquante." });
  if(!web3.isAddress(address) || address === nullAddress) return res.status(422).json({ "error" : "Adresse invalide." });
  else{
    var result = Labank.balanceOf(address);
    var balance = result.toNumber();
    return balance;
  }
}

exports.getBalanceOf = function(req,res,next){
  if(!req.params.address) return res.status(422).json({ "error" : "Adresse manquante." });
  if(!web3.isAddress(req.params.address) || req.params.address === nullAddress) return res.status(422).json({ "error" : "Adresse invalide." });
  else{
    var result = Labank.balanceOf(req.params.address);
    var balance = result.toNumber();
    return res.status(200).json({ balance : balance });
  }
};

exports.getLastUser = function(){
  var value = Labank.getLastUser();
  var address = Labank.getUser(value.toNumber()-1);
  return address;
};

 /* SETTERS */

function waitToBeMined(txnHash, callback){
  var transactionReceiptAsync;
  const interval = 500;
  var timeout = 10000;
  transactionReceiptAsync = function(txnHash) {
    console.log("pending transaction...");
    var receipt = web3.eth.getTransactionReceipt(txnHash);
    if (receipt == null) {
      if(timeout <= 0 ) return callback(false, "Mining timeout exceeded (10s) Miners may be not mining");
      else{
        setTimeout(function () {
          timeout -= interval;
          transactionReceiptAsync(txnHash);
        }, interval);
      }
    } else {
      return callback(true, "Transaction "+txnHash+" mined");
    }
  };
  transactionReceiptAsync(txnHash);
}

exports.insertUser = function(req,res,next){
  Labank.insertUser(initialAmount, { from :coinbase, gas: 1000000 }, function(err, transactionHash){
    waitToBeMined(transactionHash, function(mined, msg){
      var length = Labank.getLastUser();
      var address = Labank.getUser(length.toNumber()-1);
      if(err) return next(err);
      else return res.status(200).json({ address : address, mined : mined, msg : msg });
    });
  });
};

exports.addSkill = function(req,res,next){
  if(!req.params.skill) return res.status(422).json({ "error" : "Compétence requise." });
  if(!req.params.address) return res.status(422).json({ "error" : "Adresse manquante." });
  if(!web3.isAddress(req.params.address) || req.params.address === nullAddress) return res.status(422).json({ "error" : "Adresse invalide." });
  else{
    let skill = web3.toHex(req.params.skill);
    Labank.addSkill(req.params.address, skill, { from : coinbase, gas : 1000000 }, function(err, transactionHash){
      waitToBeMined(transactionHash, function(){
        if(err) return next(err);
        return res.status(200).json({ skills : transactionHash,  mined : mined, msg : msg });
      });
    });
  }
};

exports.removeSkill = function(req,res,next){
  if(!req.params.skill) return res.status(422).json({ "error" : "Compétence requise." });
  if(!req.params.address) return res.status(422).json({ "error" : "Adresse manquante." });
  if(!web3.isAddress(req.params.address) || req.params.address === nullAddress) return res.status(422).json({ result : "Adresse invalide." });
  else{
    let skill = web3.toHex(req.params.skill);
    Labank.removeSkill(req.params.address, skill, { from : coinbase, gas : 1000000 }, function(err, transactionHash){
      waitToBeMined(transactionHash, function(){
        if(err) return next(err);
        return res.status(200).json({result : transactionHash});
      });
    });
  }
};

exports.transfer = function(req,res,next){
  if(req.params.amount == null) return res.status(422).json({ "error" : "Ecrous insuffisants." });
  if(!req.params.to) return res.status(422).json({ "error" : "Adresse manquante." });
  if(!web3.isAddress(req.params.to) || req.params.to === nullAddress) return res.status(422).json({ "error" : "Adresse invalide." });
  else{
    Labank.transfer(req.params.to, req.params.amount, { from : coinbase, gas : 1000000 }, function(err, transactionHash){
      waitToBeMined(transactionHash, function(){
        if(err) return next(err);
        else return res.status(200).json({ result : transactionHash });
      });
    });
  }
};

exports.pay = function pay(from, amount, callback){
  if(amount == null) return callback("Ecrous insuffisants.");
  if(!from) return callback("Adresse manquante.");
  if(!web3.isAddress(from) || from === nullAddress) return callback("Adresse invalide.");
  else{
    Labank.reduce(from, amount, { from : coinbase, gas : 1000000 }, function(err, transactionHash){
      waitToBeMined(transactionHash, function(mined, msg){
        if(err) return callback(err);
        else return callback(null, msg);
      });
    });
  }
};
