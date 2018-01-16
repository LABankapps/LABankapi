const mongoose = require('mongoose'),
      config = require('../../config/main')

//connect to MongoDB
exports.mongodbConnect = function mongodbConnect(){
    mongoose.connect(config.uri, config.option, function(err) {
    if(err) console.log('connection error', err);
      console.log('connection successful');
  });
}
