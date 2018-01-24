const Web3 = require('web3');
const compiledContract = require('../../contracts/LABankdapp');
const contractAddress = "0xea569425210b350191a4e2032dcb1af2589eb25d"; //returned after deploy
const nullAddress = "0x0000000000000000000000000000000000000000";
const localhost = "http://localhost:8545";
const web3 = new Web3(new Web3.providers.HttpProvider(localhost));
const Contract = web3.eth.contract(compiledContract.abi);
const initialAmount = 100;
const Labank = Contract.at(contractAddress); // instantiate by address
const coinbase = web3.eth.coinbase; //get eth.defaultAccount (synchronously)

exports.getSkills = function(req,res,next){
  if(!req.params.address) return res.status(422).json({ "error" : "Missing address"});
  if(!web3.isAddress(req.params.address) || req.params.address === nullAddress ) return res.status(422).json({ "error" : "invalid address" });
  else{
    var result = Labank.getSkills(req.params.address);
    var array = [];
    if(!Array.isArray(result)) return res.status(300).json({ "error" : "Skills have to be an array" });
    else{
      for(let skill of result){
        array.push({ name : web3.toAscii(skill).replace(/\0/g, '') });
      }
      return res.status(200).json({ skills : array });
    }
  }
};

exports.getBalance = function getBalance(address){
  if(!address) return res.status(422).json({ "error" : "missing user address" });
  if(!web3.isAddress(address) || address === nullAddress) return res.status(422).json({ "error" : "invalid address" });
  else{
    var result = Labank.balanceOf(address);
    var balance = result.toNumber();
    return balance;
  }
}

exports.getBalanceOf = function(req,res,next){
  if(!req.params.address) return res.status(422).json({ "error" : "missing user address" });
  if(!web3.isAddress(req.params.address) || req.params.address === nullAddress) return res.status(422).json({ "error" : "invalid address" });
  else{
    var result = Labank.balanceOf(req.params.address);
    var balance = result.toNumber();
    return res.status(200).json({ balance : balance });
  }
};

 /* SETTERS */

exports.insertUser = function(req,res,next){
  Labank.insertUser(initialAmount, { from :coinbase, gas: 1000000 }, function(err, transactionHash){
    if(err) return next(err);
    else{
      var length = Labank.getLastUser();
      var address = Labank.getUser(length-1);
      return res.status(200).json({ address : address });
    }
  });
};

exports.addSkill = function(req,res,next){
  if(!req.params.skill) return res.status(422).json({ "error" : "missing skill" });
  if(!req.params.address) return res.status(422).json({ "error" : "missing address" });
  if(!web3.isAddress(req.params.address) || req.params.address === nullAddress) return res.status(422).json({ "error" : "invalid address" });
  else{
    let skill = web3.toHex(req.params.skill);
    Labank.addSkill(req.params.address, skill, { from : coinbase, gas : 1000000 }, function(err, transactionHash){
      if(err) return next(err);
      return res.status(200).json({ skills : transactionHash });
    });
  }
};

exports.removeSkill = function(req,res,next){
  if(!req.params.skill) return res.status(422).json({ "error" : "missing params" });
  if(!req.params.address) return res.status(422).json({ "error" : "missing user address" });
  if(!web3.isAddress(req.params.address) || req.params.address === nullAddress) return res.status(422).json({ result : "invalid address" });
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
  if(!req.params.amount) return res.status(422).json({ "error" : "missing amount" });
  if(!req.params.to) return res.status(422).json({ "error" : "missing user address" });
  if(!web3.isAddress(req.params.to) || req.params.to === nullAddress) return res.status(422).json({ "error" : "invalid address" });
  else{
    Labank.transfer(req.params.to, req.params.amount, { from : coinbase, gas : 1000000 }, function(err, transactionHash){
      if(err) return next(err);
      else return res.status(200).json({ result : transactionHash });
    });
  }
};

exports.pay = function pay(from, amount, callback){
  if(!amount) return callback("missing amount");
  if(!from) return callback("missing user address");
  if(!web3.isAddress(from) || from === nullAddress) return callback("invalid address");
  else{
    Labank.reduce(from, amount, { from : coinbase, gas : 1000000 }, function(err, transactionHash){
      if(err) return callback(err);
      else return callback(null, transactionHash);
    });
  }
}
