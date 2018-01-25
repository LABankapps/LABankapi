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
  Record.findById(req.params.id, (err, record) => {
    if(record.status === 'Waiting'){
      return res.status(400).json({ error: "Réservation déjà éfféctuée."});
    }
    if (err) {
      return res.status(400).json({ error: "Aucune réservation."});
    }
    setRecordInfo.FindUser(record.from, (err, user) => {
      if(err || !user){
        return res.status(400).json({ error: "Aucun utilisateur de trouvé." });
      }
      if(user.profile.blockChainId){
        var balance = blockChainController.getBalance(user.profile.blockChainId);
        if(balance >= record.price){
          //process to paiement
          blockChainController.pay(user.profile.blockChainId, record.price, (err, transactionHash) => {
            if(err){
              console.log(err);
              return res.status(400).json({ error: "Aucun utilisateur de trouvé." });
              return next(err);
            }

            record.status = "Accept";

            record.save(function(err, record) {
              if (err) { return next(err); }
              return res.status(200).json({ record : record });
            });
          });
        }else{
          return res.status(400).json({ error: "Argent insuffisant." });
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
