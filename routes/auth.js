module.exports = function (apiRouter) {
	var User = require('../public/models/user');
	var jwt = require('jsonwebtoken');
	var config = require('../config.js');
	var jwtSecret = config.jwtSecret;


	apiRouter.post('/auth', function (req, res) {
		User.findOne( {
			username: req.body.username
		}).select('name username password').exec( function (err, user) {
			if (err) throw err;

			if (!user) {
				res.json({
					success: false,
					message: 'User not found'
				});
			} else if (user) {
				var validPassword = user.comparePassword(req.body.password);
				if (!validPassword) {
					res.json( {
						success: false,
						message: 'Wrong password.'
					});
				} else {
					var token = jwt.sign({
						name: user.name,
						username: user.username,
						_id: user._id
					}, jwtSecret, {
						expiresIn: 360000
					});

					res.json({
						success: true,
						message: 'Token created',
						token: token
					});
				}
			}
		});	
	});
}
