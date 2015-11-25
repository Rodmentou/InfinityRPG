var	mongoose = require('mongoose');
var UserModel = require('../models/user');
Q = require('q');

module.exports = function (api, players) {
	var jwt = require('jsonwebtoken');
	var jwtSecret = 'luanaLinda';

	api.post('/signup', function (req, res) {

		var username = req.body.username;
		var password = req.body.password;
		if(username && password){
			var userModel = new UserModel(req.body);


			UserModel.find(
			{ username: username, password: password},
			findUser ).then( function () {
				if (!players[username]) { //If player not in memory, create it.
					console.log('Username not in use');

					var token = createNewToken(username, jwtSecret);
					var user = createNewPlayer(username);

					players[username] = user;
					res.json({user: user, token: token});


				} else { //If there is a player in memory.
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
			}, function () {
				userModel.save( function (err) {
					if (!err) {
						console.log('User created');
					}
				});
			});


		} else {
			res.json({success: false, message: 'Need to send both username and password.'});
		};
	});

	var findUser = function (err, data) {
		var logged = false;
		var userSearched = Q.defer();
		if (data.length) {
			logged = true;
			userSearched.resolve();
		} else {
			userSearched.reject();
		}

		return userSearched.promise;
	};

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
