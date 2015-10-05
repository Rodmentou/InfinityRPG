module.exports = function (apiRouter) {
	var User = require('../public/models/user');
	apiRouter.post('/signup', function (req, res) {
		var user = new User();

		user.name = req.body.name;
		user.username = req.body.username;
		user.password = req.body.password;
		user.maxHp = 200;
		user.hp = 200;
		user.exp = 0;
		user.def = 1;
		user.atk = 2;

		user.save( function (err) {
			if (err) {
				if (err.code == 11000) {
					return res.json({ success: false, message: 'User already exists'});
				} else { return res.send(err) }
			}
			res.json({ message: 'User created'});
		});
	});
}