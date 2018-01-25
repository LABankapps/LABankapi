const Record = require('../models/record');
const setRecordInfo = require('../_helpers/setRecordInfo');
const blockChainController = require("./blockchain");

//= =======================================
// Record Routes
//= =======================================

exports.create = function(from, engine, date, duration, price){
  let record = new Record({
    "from": from,
    "engine": engine,
    "date": date,
    "duration": duration,
    "price": price
  });

  record.save(function(err, record) {
    if (err) { return next(err); }
  });
}

exports.getByUserId = function (req, res, next) {
  const userId = req.params.id;
  Record.find((err, records) => {
    if (err) {
      res.status(400).json({ error: 'Something gone wrong.' });
      return next(err);
    }

    let recordsUser = records.filter(record => record.from === userId);

    return res.status(200).json({ records: recordsUser });
  });
};

exports.approveRecord = function (req, res, next) {
  Record.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, record, recordUpdate) => {
    if (err) {
      res.status(400).json({ error: "Can't find record"});
      return next(err);
    }
    setRecordInfo.FindUser(record.from, (err, user) => {
      if(err){
        res.status(400).json({ error: "Can't find user" });
        return next(err);
      }
      if(!user) //

      if(user.blockChainId){
        var balance = blockChainController.getBalance(user.blockChainId);
        
        if(balance >= record.price){
          //process to paiement
          blockChainController.pay(user.blockchain, record.price, (err, transactionHash) => {
            if(err){
              res.status(400).json({ error: "Can't find user" });
              return next(err);
            }
            return res.status(200).json({ result : transactionHash });
          });
        }
      }
    });
  });
};

exports.getAll = function (req, res, next) {
  Record.find((err, records) => {
    if (err) {
      res.status(400).json({ error: 'Something gone wrong.' });
      return next(err);
    }

    for(record of records){ //Hack syncrhone #Horrible code
      if(record === records[records.length -1]){
        record = setRecordInfo.setRecordInfo(record, () => {
          return res.status(200).json({ records: records });
        });
      }else{
        record = setRecordInfo.setRecordInfo(record);
      }
    }
  });
};
