var	mongoose = require('mongoose');
var UserModel = require('../models/user');

module.exports = function (api, players) {
	var jwt = require('jsonwebtoken');
	var jwtSecret = 'luanaLinda';

	api.post('/signup', function (req, res) {

		var username = req.body.username;
		var password = req.body.password;

		if(username && password){
			UserModel.find(req.body)
			.then(findUser, findUserErr)
			.then(function(data) { userFound(data, res)},
						function(data) { createUser(data, req, res); });
		} else {
			res.json({success: false, message: 'Need to send both username and password.'});
		};
	});


	var userFound = function (data, res) {
		var username = data.username;
		var jwtSecret = 'luanaLinda';
		var token = createNewToken(username, jwtSecret);

		if (players[username]) { //PLAYER LOGGED. GIVE IT BACK!
			var user = players[username];
			res.json({user: user, token: token});

		} else { //PLAYER NOT IN MEMORY. CREATE IT AND SEND!
			var user = createNewPlayer(username);
			players[username] = user;
			res.json({user: user, token: token});
		}

	};

	var findUserErr = function (err) {
		console.log('Rejected on find');
	};

	var createUser = function (err, req, res) {
		var userModel = new UserModel(req.body);
		userModel.save ( function (err, data) {
			if (!err) {
				userFound(data, res);
			} else {
				res.json({success: false, message: 'User already exist!'});
			}
		});
	}

	var findUser = function(data) {
			if (data.length) {
				return data[0];
			} else {
				var reason = 'Rejected on findUser';
				throw reason;
			}
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
