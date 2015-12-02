var mongoose = require('mongoose');
var UserModel = mongoose.model('UserModel',
  {
    username: { type: String, unique: true},
    password: { type: String, select: false},
    maxLevel: Number
  });

module.exports = mongoose.model('UserModel', UserModel);
