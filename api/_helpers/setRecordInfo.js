const User = require('../models/user');
const Engine = require('../models/engine');

exports.setRecordInfo = function setRecordInfo(record, ...callback){
  User.findById(record.from, (err, user) => {
    record.from = user.email;
    Engine.findById(record.engine, (err, engine) => {
       record.engine = engine.name;
       if(callback.length > 0){
         callback[0]();
       }
     });
  });
}
