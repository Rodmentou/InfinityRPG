module.exports = function (api) {
	var jwt = require('jsonwebtoken');
	var jwtSecret = 'luanaLinda';

	api.use( function (req, res, next) {
		var token = req.body.token || req.headers['x-access-token'];

		if (token) {
			jwt.verify(token, jwtSecret, function (err, decoded) {
				if (err) {
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
			return res.status(403).json({
				success: false,
				message: 'Token needed.'
			});
		}
	});
}
