let Web3 = require('web3');
const compiledContract = require('../../contracts/LABankdapp');
const localhost = "http://localhost:8545";
const contractAddress = "0x2Bfe786a22199A167AAbDA98A43982642ECF3423"; //returned after deploy
const nullAddress = "0x0000000000000000000000000000000000000000";
const web3 = new Web3(new Web3.providers.HttpProvider(localhost));
const Labank = new web3.eth.Contract(compiledContract.abi, contractAddress);

web3.utils.isAddress(contractAddress);

exports.getSender = function(req,res,next){
  web3.eth.getCoinbase().then(function(coinbase){
    Labank.methods.getSender().call({from : coinbase}, function(err, result){
      if(err) return next(err);
      let r = (result !== nullAddress) ? result : null;
      return res.status(200).json({result : r});
    });
  });
}

exports.greet = function(req,res,next){
  Labank.methods.greet().call({from : ""}, function(err, result){
    if(err) return next(err);
    let t = web3.utils.hexToAscii(result);
    return res.status(200).json({ result : t.replace(/\0/g, '') });
  });
};

exports.getUser = function(req,res,next){
  Labank.methods.getUser(req.params.index).call({from : ""}, function(err, result){
    if(err) return next(err);
    let r = (result !== nullAddress) ? result : null;
    return res.status(200).json({result : r});
  });
};

exports.getSkills = function(req,res,next){
  Labank.methods.getSkills(req.params.address).call({from : ""}, function(err, result){
    if(err) return next(err);
    if(!Array.isArray(result)) return res.status(300).json({result : "Skills have to be an array"});
    else{
      let arr;
      for(let skill of result){
        let temp = web3.utils.hexToAscii(skill);
        arr.push(temp.replace(/\0/g, ''));
      }
      return res.status(200).json({result : arr});
    }
  });
};

exports.getName = function(req,res,next){
  Labank.methods.name().call({from : ""}, function(err, result){
    if(err) return next(err);
    let temp = web3.utils.hexToAscii(result);
    return res.status(200).json({ result : temp.replace(/\0/g, '') });
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
    let temp = web3.utils.hexToAscii(result);
    return res.status(200).json({ result : temp.replace(/\0/g, '') });
  });
};

exports.getBalanceOf = function(req,res,next){
  Labank.methods.balanceOf(req.params.address).call({from : ""}, function(err, result){
    if(err) return next(err);
    let balance = web3.utils.fromWei(result, "ether");
    return res.status(200).json({result : balance});
  });
};

 /* SETTERS */

exports.setGreeter = function(req,res,next){
  web3.eth.getCoinbase().then(function(coinbase){
    web3.eth.personal.unlockAccount(coinbase, "").then(function(result){
      let bytes32 = web3.utils.utf8ToHex(req.body.greet);
      Labank.methods.setGreeter(bytes32).send({ from : coinbase, gas:1000000 }, function(err, transactionHash){
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
        let bytes32 = web3.utils.utf8ToHex(req.body.skill);
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
      let bytes32 = web3.utils.utf8ToHex(req.body.skill);
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
