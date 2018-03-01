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
    if (err ||!record) {
      console.log(err);
      return res.status(400).json({ error: "Réservation supprimée ou inexistante."});
    }
    else if(record.status === 'Accepted'){
      return res.status(400).json({ error: "Réservation déjà éfféctuée."});
    }
    else if(record.status === 'Canceled'){
      return res.status(400).json({ error: "Réservation annulée."});
    }
    setRecordInfo.FindUser(record.from, (err, user) => {
      if(err || !user){
        return res.status(400).json({ error: "Aucun utilisateur trouvé." });
      }
      else{
        if(user.profile && user.profile.blockChainId){
          var balance = blockChainController.getBalance(user.profile.blockChainId);
          console.log(balance);
          if(balance >= record.price){
            //process to paiement
            var balance = blockChainController.getBalance(user.profile.blockChainId);
            blockChainController.pay(user.profile.blockChainId, record.price, (err, msg) => {
              console.log(msg);
              if(err){
                console.log(err);
                return res.status(400).json({ error: msg });
              }
              else{

                setTimeout(function(){
                  var balance = blockChainController.getBalance(user.profile.blockChainId);
                  console.log("balance after paiement " + balance);

                  record.status = "Accepted";
                  record.save(function(err, record) {
                    if (err || !record) {
                      console.log(err);
                      return next(err);
                    }
                    return res.status(200).json({ record : record });
                  });
                }, 3000);
              }
            });
          }else{
            return res.status(400).json({ error: "ECROUS insuffisant." });
          }
        }
        else{
          return res.status(400).json({ error: "Blockchain addresse de l'utilsateur introuvable." });
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
