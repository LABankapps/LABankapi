var Web3 = require('web3');
const compiledContract = require('../../contracts/LABankdapp');
const localhost = "http://localhost:8545";
const contractAddress = "0x9Aeb7D36E350E4A5D391728277ed6173b90E6E36"; //returned after deploy
var web3 = new Web3(new Web3.providers.HttpProvider(localhost));
var Labank = new web3.eth.Contract(compiledContract.abi, contractAddress);

web3.utils.isAddress(contractAddress);

exports.getSender = function(req,res,next){
  web3.eth.getCoinbase().then(function(coinbase){
    Labank.methods.getSender().call({from : coinbase}, function(err, result){
      if(err) return next(err);
      //var r = (result !== nullAddress) ? result : null;
      return res.status(200).json({result : result});
    });
  });
}

exports.greet = function(req,res,next){
  Labank.methods.greet().call({from : ""}, function(err, result){
    if(err) return next(err);
    return res.status(200).json({result : result});
  });
};

exports.getUser = function(req,res,next){
  Labank.methods.getUser(req.params.index).call({from : ""}, function(err, result){
    if(err) return next(err);
    //var r = (result !== nullAddress) ? result : null;
    return res.status(200).json({result : result});
  });
};

exports.getSkills = function(req,res,next){
  Labank.methods.getSkills(req.params.address).call({from : ""}, function(err, result){
    if(err) return next(err);
    if(!Array.isArray(result)) return res.status(300).json({result : "Skills have to be an array"});
    else{
      var arr;
      for(let skill of result){
        arr.push(web3.utils.hexToAscii(skill));
      }
      return res.status(200).json({result : arr});
    }
  });
};

exports.getName = function(req,res,next){
  Labank.methods.name().call({from : ""}, function(err, result){
    if(err) return next(err);
    return res.status(200).json({result : result});
  });
};

exports.getDecimals = function(req,res,next){
  Labank.methods.decimals().call({from : ""}, function(err, result){
    if(err) return next(err);
    return res.status(200).json({result : Number(result) });
  });
};

exports.getSymbol = function(req,res,next){
  Labank.methods.symbol().call({from : ""}, function(err, result){
    if(err) return next(err);
    return res.status(200).json({result : result});
  });
};

exports.getBalanceOf = function(req,res,next){
  Labank.methods.balanceOf(req.params.address).call({from : ""}, function(err, result){
    if(err) return next(err);
    var balance = web3.utils.fromWei(result, "ether");
    return res.status(200).json({result : balance});
  });
};

 /* SETTERS */

exports.setGreeter = function(req,res,next){
  web3.eth.getCoinbase().then(function(coinbase){
    web3.eth.personal.unlockAccount(coinbase, "").then(function(result){
      var bytes32 = web3.utils.utf8ToHex(req.body.greet);
      console.log(bytes32);
      Labank.methods.setGreeter(bytes32).send({ from : coinbase, gas:30000 }, function(err, transactionHash){
        if(err) return next(err);
        return res.status(200).json({result : transactionHash});
      });
    });
  });
};

exports.insertUser = function(req,res,next){
  web3.eth.getCoinbase().then(function(coinbase){
    web3.eth.personal.unlockAccount(coinbase, "", function(err) {
      Labank.methods.insertUser().send({from :coinbase, gas: 1000000 }, function(err, transactionHash){
        if(err) return next(err);
        return res.status(200).json({result : transactionHash});
      });
    });
  });
};

exports.addSkill = function(req,res,next){
  web3.eth.getCoinbase().then(function(coinbase){
    web3.eth.personal.unlockAccount(coinbase, "").then(function(result){
      if(result){
        var bytes32 = web3.utils.utf8ToHex(req.body.skill);
        Labank.methods.addSkill(req.body.addres, bytes32).send({ from : coinbase, gas : 1000000 }, function(err, transactionHash){
          if(err) return next(err);
          return res.status(200).json({result : transactionHash});
        });
      }
    });
  });
};

exports.removeSkill = function(req,res,next){
  web3.eth.getCoinbase().then(function(coinbase){
    web3.eth.personal.unlockAccount(coinbase, "", function(err) {
      var bytes32 = web3.utils.utf8ToHex(req.body.skill);
      Labank.methods.removeSkill(req.body.address, bytes32).send({ from : coinbase, gas : 1000000 }, function(err, transactionHash){
        if(err) return next(err);
        return res.status(200).json({result : transactionHash});
      });
    });
  });
};

exports.transfer = function(req,res,next){
  web3.eth.getCoinbase().then(function(coinbase){
    web3.eth.personal.unlockAccount(coinbase, "", function(err) {
      Labank.methods.transfer(req.body.to, req.body.amount).send({ from : coinbase, gas : 1000000 }, function(err, transactionHash){
        if(err) return next(err);
        return res.status(200).json({result : transactionHash});
      });
    });
  });
};

exports.reduce = function(req,res,next){
  web3.eth.getCoinbase().then(function(coinbase){
    web3.eth.personal.unlockAccount(coinbase, "", function(err) {
      Labank.methods.reduce(req.body.from, req.body.amount).send({ from : coinbase, gas : 1000000 }, function(err, transactionHash){
        if(err) return next(err);
        return res.status(200).json({result : transactionHash});
      });
    });
  });
};
