module.exports = function (apiRouter) {
	var jwt = require('jsonwebtoken');
	var config = require('../config.js');
	var jwtSecret = config.jwtSecret;

	
	apiRouter.use( function (req, res, next) {
		var token = req.body.token || req.headers['x-access-token'];

		if (token) {
			jwt.verify(token, jwtSecret, function (err, decoded) {
				if (err) {
					console.log(err);
					return res.status(403).send({
						success: false,
						message: 'Auth failed'
					});
				} else {
					req.decoded = decoded;

					next();
				}
			});

		} else {
			return res.status(403).send({
				success: false,
				message: 'Token needed.'
			});
		}

	});
}
	