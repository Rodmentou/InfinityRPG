var mongoose = require('mongoose');
var UserModel = mongoose.model('UserModel',
  {
    username: { type: String, unique: true},
    password: String    
  });

module.exports = mongoose.model('UserModel', UserModel);
