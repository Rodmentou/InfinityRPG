module.exports = function (api) {

	api.use( function (req, res, next) {
		var token = req.body.token || req.headers['x-access-token'];

		if (token) {
			req.decoded = {};
			req.decoded.username = req.headers['x-access-token'];
			next();

		} else {
			return res.status(403).send({
				success: false,
				message: 'Token needed.'
			});
		}

	});
}
