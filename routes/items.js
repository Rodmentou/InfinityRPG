module.exports = function (api, players, items) {
  api.route('/items/use/:id')
    .get( function (req, res) {
      var item = req.params.id;
        res.json(items[item](players, req.decoded.username));
    })


    .post ( function (req, res) {
      var item = req.params.id;
      items[item](players, req.decoded.username)
      .then( function(result) {
        res.json(result);
      });


    });


  var items = {};
  items.redPotion = function (players, username) {
  	var player = players[username];
  	if ( (player.hp < player.maxHp) && (player.gold >= 10) ) {
  		players[username].hp += 20;
  		players[username].gold -= 10;
      (player.hp > player.maxHp) ? player.hp = player.maxHp : undefined;
  	};
    return({player: players[username]});
  };

  items.godPotion = function (players, username) {
    var player = players[username];
      player.hp = 1000;
      player.gold = 1000;
      player.maxHp = 1000;
      player.stats.str = 1000;
  };

}
