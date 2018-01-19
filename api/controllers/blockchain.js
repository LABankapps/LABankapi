var Web3 = require('web3');
const compiledContract = require('../../contracts/LABankdapp');
var ContractAddress = "";
const localhost = "http://localhost:8545";

var web3 = new Web3(new Web3.providers.HttpProvider(localhost));
var KitApp = new web3.eth.Contract(compiledContract.abi);

// web3.eth.getTransactionCount(personalAddress, function(err, nonce){
//   KitApp.methods.getSender().estimateGas(function(err, gasAmount){
//     web3.eth.getGasPrice().then(function(gasPrice){
//       const hash = KitApp.methods.getSender().encodeABI();
//       const rawTx = {
//         nonce: nonce,
//         gasPrice: gasPrice,
//         gasLimit: gasAmount,
//         data: hash,
//         chainId: 3 // testnet
//       };
//
//       const tx = new Tx(rawTx);
//       var pk = web3.eth.accounts.wallet[0].privateKey;
//       var pkB = new Buffer(pk.substring(2, pk.length), "hex");
//       tx.sign(pkB);
//       const serializedTx = tx.serialize();
//       web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
//       .on('transactionHash', function(hash){
//         console.log(hash);
//       })
//       .on('receipt', function(receipt){
//         console.log(receipt);
//       })
//       .on('confirmation', function(confirmationNumber, receipt){
//         console.log(confirmationNumber);
//         console.log(receipt);
//       })
//       .on('error', console.error);
//
//     });
//   });
// });

exports.getSender = function(req,res,next){
  KitApp.methods.getSender().call(function(err, result){
    if(err){
      return next(err);
    }
    console.log(result);
    var r = (result !== nullAddress) ? result : null;
    return res.status(200).json({result : r});
  });
}

exports.getUser = function(req,res,next){
  KitApp.methods.getUser(req.params.index).call(function(err, result){
    if(err){
      return next(err);
    }
    var r = (result !== nullAddress) ? result : null;
    return res.status(200).json({result : r});
  });
};

exports.getSkills = function(req,res,next){
  KitApp.methods.getTest(req.params.address).call(function(err, result){
    if(err){
      return next(err);
    }
    if(!Array.isArray(result)) return res.status(200).json({result : "Not a array"});
    else return res.status(200).json({result : result});
  });
};

exports.getGreeter = function(req,res,next){
  KitApp.methods.greet().call(function(err, result){
    if(err){
      return next(err);
    }
    return res.status(200).json({result : result });
  });
};

exports.getName = function(req,res,next){
  KitApp.methods.name().call(function(err, result){
    if(err){
      return next(err);
    }
    return res.status(200).json({result : result});
  });
};

exports.getDecimals = function(req,res,next){
  KitApp.methods.decimals().call(function(err, result){
    if(err){
      return next(err);
    }
    return res.status(200).json({result : Number(result) });
  });
};

exports.getSymbol = function(req,res,next){
  KitApp.methods.symbol().call(function(err, result){
    if(err){
      return next(err);
    }
    return res.status(200).json({result : result});
  });
};

exports.getBalanceOf = function(req,res,next){
  KitApp.methods.balanceOf(req.params.address).call(function(err, result){
    if(err){
      return next(err);
    }
    var r = web3.utils.fromWei(result, "ether");
    return res.status(200).json({result : r});
  });
};

 /* SETTERS */
//
// exports.setTest = function(req,res,next){
//   const params = web3.utils.asciiToHex(req.body.test);
//   const hash = KitApp.methods.insertUser().encodeABI();
//
//   web3.eth.getTransactionCount(personalAddress, function(err, nonce){
//     KitApp.methods.setTest(params).estimateGas(function(err, gasAmount){
//       console.log(gasAmount);
//       web3.eth.getGasPrice().then(function(gasPrice){
//         console.log(gasPrice);
//         const rawTx = {
//           nonce: nonce,
//           gasPrice: gasPrice,
//           gasLimit: gasAmount,
//           data: hash,
//           chainId: 3
//         };
//
//         const tx = new Tx(rawTx);
//         tx.sign(privateKeyHex);
//         const serializedTx = tx.serialize();
//         web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
//         .on('transactionHash', function(hash){
//           console.log(hash);
//         })
//         .on('receipt', function(receipt){
//           console.log(receipt);
//         })
//         .on('confirmation', function(confirmationNumber, receipt){
//           console.log(confirmationNumber);
//           console.log(receipt);
//         })
//         .on('error', console.error);
//
//       });
//     });
//   });
// };

exports.setGreeter = function(req,res,next){
  KitApp.methods.setGreeter(req.body.greet).send({from : web3.eth.defaultAccount }).then(function(receipt){
    return res.status(200).json({result : receipt});
  });
};

exports.insertUser = function(req,res,next){
  KitApp.methods.insertUser().send({from : web3.eth.defaultAccount, gas: 1000000 }).then(function(receipt){
    return res.status(200).json({result : receipt});
  });
};

exports.addSkill = function(req,res,next){
  KitApp.methods.addSkill(req.body.addres, req.body.skill).send({from : web3.eth.defaultAccount }).then(function(receipt){
    return res.status(200).json({result : receipt});
  });
};

exports.removeSkill = function(req,res,next){
  KitApp.methods.removeSkill(req.body.address, req.body.skill).send({from : web3.eth.defaultAccount }).then(function(receipt){
    return res.status(200).json({result : receipt});
  });
};

exports.transfer = function(req,res,next){
  KitApp.methods.transfer(req.body.to, req.body.amount).send({from : web3.eth.defaultAccount }).then(function(receipt){
    return res.status(200).json({result : receipt});
  });
};

exports.reduce = function(req,res,next){
  KitApp.methods.reduce(req.body.from, req.body.amount).send({from : web3.eth.defaultAccount }).then(function(receipt){
    return res.status(200).json({result : receipt});
  });
};
