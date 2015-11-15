module.exports = function (api, players, items) {
  api.route('/items/use/:id')
    .get( function (req, res) {
      var item = req.params.id;
        items[item](players, req.decoded.username);

      res.json({success: true, message: 'Wellcome!'});
    });


  var items = {};
  items.redPotion = function (players, username) {
  	var player = players[username];
  	if ( (player.hp <= 200) && (player.gold >= 10) ) {
  		players[username].hp += 20;
  		players[username].gold -= 10;
  	};
  };
}
