module.exports = function (api, players) {
	api.post('/signup', function (req, res) {

		var user = {};
		if(req.body.username){
			if (!players[req.body.username]) {

				user = {
					username: req.body.username,
					maxHp: 200,
					hp: 200,
					exp: 1,
					def: 10,
					atk: 10,
					gold: 50,


					stats: {
						str: 5,
						int: 5,
						dex: 5,
						pointsUsed: 0
					},

					equips: {
						head: [],
						leftHand: [],
						rightHand: [],
						bothHand: [],
						chest: [],
						legs: [],
						feet: []
					},

					history: []
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
