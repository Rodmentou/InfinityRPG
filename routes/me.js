var	mongoose = require('mongoose');
var UserModel = require('../models/user');

module.exports = function (api, players) {

  api.get('/me', function (req, res) {
    res.json(players[req.decoded.username]);
  });

  api.post('/me/stats', function (req, res) {
    var stat = req.body.stat;
    var player = players[req.decoded.username];

    if ( player.stats.pointsUsed < Math.sqrt(player.exp) + 5) {
      player.stats.pointsUsed ++;
      if (stat == 'str') player.maxHp += 15;
      player.stats[stat] += 1;
      res.json({player: player, success: true, message: "Stat " + stat + " upgraded."});
    } else {
      res.json({player: player, success: false, message: "Not enought points."});
    };

  });

}
