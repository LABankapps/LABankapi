const User = require('../models/user');
const Engine = require('../models/engine');

exports.setRecordInfo = function setRecordInfo(record, ...callback){
  User.findById(record.from, (err, user) => {
    if(user !== null){
      record.from = user.email;
    }else{
      record.from = 'Utilisateur inconnu';
    }
    Engine.findById(record.engine, (err, engine) => {
      if(engine !== null){
        record.engine = engine.name;
      }else{
        record.engine = 'Machine inconnu';
      }
       (() => {
         if(callback.length > 0){
           callback[0]();
         }
       })();
     });
  });
}

exports.FindUser = function(uid, callback){
  User.findById(uid, (err, user) => {
    if(err || !user) callback(err);
    else callback(null, user);
  });
}
