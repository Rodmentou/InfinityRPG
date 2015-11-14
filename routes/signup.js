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
				user.gold = 10;

				user.stats = {
					str: 5,
					int: 5,
					dex: 5 };
				user.equips = {
					head: [],
					leftHand: [],
					rightHand: [],
					bothHand: [],
					chest: [],
					legs: [],
					feet: []
				};



				//players.push(user);
				var username = user.username;
				players[username] = user;
				res.json(user);
			} else {
				res.json({success: false, message: 'Username in use.'});
			};
		} else {
			res.json({success: false, message: 'Username empty.'});
		};
	});
}
