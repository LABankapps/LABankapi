const mongoose = require('mongoose'),
      config = require('../../config/main')

//connect to MongoDB
exports.mongodbConnect = function mongodbConnect(){
    mongoose.Promise = global.Promise;
    mongoose.set('debug', true);
    mongoose.connect(config.uri, config.option, function(err) {
    if(err) console.log('connection error', err);
    else console.log('connection successful');

    mongoose.connection.on('open', function() {
      mongoose.connection.db.admin().serverStatus(function(error, info) {
        console.log(info.version);
      });
    });
  });
}
