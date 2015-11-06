module.exports = function (apiRouter) {
	var User = require('../public/models/user.js');


	apiRouter.route('/users')
		.post( function (req, res) {
			var user = new User();

			user.name = req.body.name;
			user.username = req.body.username;
			user.password = req.body.password;

			user.save( function (err) {
				if (err) {
					if (err.code == 11000) {
						return res.json({ success: false, message: 'User already exists'});
					} else { return res.send(err) }
				}
				res.json({ message: 'User created'});
			});
		})

		.get( function (req, res) {
			User.find( function (err, users) {
				if (err) res.send(err);

				res.json(users);
		});
	});

	apiRouter.route('/users/:user_id')
		.get( function (req, res) {
			User.findById( req.params.user_id, function (err, user) {
				if (err) res.send (err);
				res.json(user);
			});
		})

		.put( function (req, res) {
			User.findById(req.params.user_id, function (err, user) {
				if (err) res.send(err);

				if (req.body.name) user.name = req.body.name;
				if (req.body.username) user.username = req.body.username;
				if (req.body.password) user.password = req.body.password;

				user.save( function (err){
					if (err) send (err);
					res.json({message: 'User updated'});
			});
		})

		.delete( function (req, res) {
			console.log("Hello, I'm on DELETE.");
		});
	});

	apiRouter.get('/me', function (req, res) {
		User.findById(req.decoded._id, function (err, user) {
			if (err) res.send(err);
			res.json(user);
		});
	});

}