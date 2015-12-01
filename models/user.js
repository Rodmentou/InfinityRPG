var mongoose = require('mongoose');
var UserModel = mongoose.model('UserModel',
  {
    username: { type: String, unique: true},
    password: String,
    maxLevel: Number
  });

module.exports = mongoose.model('UserModel', UserModel);
