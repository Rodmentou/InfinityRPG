module.exports = function (players) {

  var createBots = require('./createBots')(players, 600);
  var addGold = require('./addGold')(players, 10000, 10);
  var addHp = require('./addHp')(players, 3600000, 10);

}
