module.exports = function (api, players) {
	api.post('/signup', function (req, res) {

		var user = {};
		if(req.body.username){
			if (!players[req.body.username]) {

				user.username = req.body.username;
				user.maxHp = 200;
				user.hp = 200;
				user.exp = 1;
				user.def = 10;
				user.atk = 20;

				players[user.username] = user;
				console.log(players);
				res.json(user);
			} else {
				res.json({success: false, message: 'Username in use.'});
			};
		} else {
			res.json({success: false, message: 'Username empty.'});
		};
	});
}
