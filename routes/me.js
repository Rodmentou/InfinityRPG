var	mongoose = require('mongoose');
var UserModel = require('../models/user');

module.exports = function (api, players) {

  api.get('/me', function (req, res) {
    res.json(players[req.decoded.username]);
  });

  api.post('/me/stats', function (req, res) {
    var stat = req.body.stat;
    var amount = req.body.amount;
    if (!amount) amount = 1;

    var player = players[req.decoded.username];
    var playerLevel = Math.round(Math.sqrt(player.exp));
    var startingPoints = 5;

    var pointsUsed = player.stats.pointsUsed;
    var pointsReceived =  playerLevel + startingPoints;
    console.log('Points Used:' + pointsUsed);
    console.log('Points received:' + pointsReceived);
    console.log('Coiso: ' + (pointsReceived - pointsUsed));

    if ( pointsUsed < pointsReceived) {
      var pointsFree = pointsReceived - pointsUsed;
      if (amount > pointsFree) amount = pointsFree;

      player.stats.pointsUsed += amount;
      if (stat == 'str') player.maxHp += 15 * amount;
      player.stats[stat] += amount;
      res.json({player: player, success: true, message: stat + "+ " + amount});
      } else {
        res.json({player: player, success: false, message: "Not enought points."});
    };
  });

}
