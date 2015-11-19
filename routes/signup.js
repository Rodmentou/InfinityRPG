var	mongoose = require('mongoose');
var UserModel = require('../models/user');

module.exports = function (api, players) {
	var jwt = require('jsonwebtoken');
	var jwtSecret = 'luanaLinda';

	api.post('/signup', function (req, res) {
		var username = req.body.username;
		var password = req.body.password;
		if(username && password){
			var userModel = new UserModel(req.body);
			var logged = false;

			UserModel.find({ username: username, password: password},
			function (err, data) {
				if (data.length) {
					logged = true;
					console.log('Logged é true');
				} else {
					userModel.save( function (err) {
						if (!err) {
							console.log('User created');
						}
					});
				}
			});

			if (!players[username]) { //If player not in memory, create it.
				console.log('Username not in use');

				var token = createNewToken(username, jwtSecret);
				var user = createNewPlayer(username);

				players[username] = user;
				res.json({user: user, token: token});


			} else { //If there is a player in memory.
				logged = true; //DEBBUG
				console.log('Username in use');
				if (logged) { //Give player back to owner.
					console.log('Username in use, but owner logging.');
					var token = createNewToken(username, jwtSecret);
					var user = players[username];
					res.json({user: user, token: token});
				} else { //Something wrong here.
					res.json({success: false, message: 'Username in use.'});
				}
			};

		} else {
			res.json({success: false, message: 'Need to send both username and password.'});
		};
	});

	var createNewPlayer = function(playerName) {
		var user = {};
		user = {
			username: playerName,
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

		return user;
	};

	var createNewToken = function(playerName, jwtSecret) {
		return jwt.sign({
			username: playerName
		}, jwtSecret, {
			expiresIn: 360000
		});
	}

}
