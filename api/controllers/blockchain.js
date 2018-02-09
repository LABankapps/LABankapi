const Web3 = require('web3');
const compiledContract = require('../../contracts/LABankdapp');
const contractAddress = "0xeaae0e3fd4552fab7757c465658ea82c7dd7baf5"; //returned after deploy
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

 /* SETTERS */

exports.getLastUser = function(req,res,next){
  var length = Labank.getLastUser();
  console.log(length.toNumber());
  var name = Labank.name();
  console.log(name);
  return res.status(200).json({ address : "sfserf" });
 };

exports.insertUser = function(req,res,next){
  Labank.insertUser(initialAmount, { from :coinbase, gas: 1000000 }, function(err, transactionHash){
    if(err) return next(err);
    else return res.status(200).json({ address : transactionHash });
  });
};

exports.addSkill = function(req,res,next){
  if(!req.params.skill) return res.status(422).json({ "error" : "Compétence requise." });
  if(!req.params.address) return res.status(422).json({ "error" : "Adresse manquante." });
  if(!web3.isAddress(req.params.address) || req.params.address === nullAddress) return res.status(422).json({ "error" : "Adresse invalide." });
  else{
    let skill = web3.toHex(req.params.skill);
    Labank.addSkill(req.params.address, skill, { from : coinbase, gas : 1000000 }, function(err, transactionHash){
      if(err) return next(err);
      return res.status(200).json({ skills : transactionHash });
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
      console.log(err);
      if(err) return next(err);
      return res.status(200).json({result : transactionHash});
    });
  }
};

exports.transfer = function(req,res,next){
  if(!req.params.amount) return res.status(422).json({ "error" : "Montant manquant." });
  if(!req.params.to) return res.status(422).json({ "error" : "Adresse manquante." });
  if(!web3.isAddress(req.params.to) || req.params.to === nullAddress) return res.status(422).json({ "error" : "Adresse invalide." });
  else{
    Labank.transfer(req.params.to, req.params.amount, { from : coinbase, gas : 1000000 }, function(err, transactionHash){
      if(err) return next(err);
      else return res.status(200).json({ result : transactionHash });
    });
  }
};

exports.pay = function pay(from, amount, callback){
  if(!amount) return callback("Montant manquant.");
  if(!from) return callback("Adresse manquante.");
  if(!web3.isAddress(from) || from === nullAddress) return callback("Adresse invalide.");
  else{
    Labank.reduce(from, amount, { from : coinbase, gas : 1000000 }, function(err, transactionHash){
      if(err) return callback(err);
      else return callback(null, transactionHash);
    });
  }
};
