module.exports = function (apiRouter) {
	var User = require('../public/models/user');

	apiRouter.route('/1x1')
		.post( function (req, res) {
			if (req.decoded._id != req.body._id) { //Are you the same person?
				User.findById( req.decoded._id, function (err, attacker) {
					if (err) res.send(err);

					User.findById ( req.body._id, function (err, defender) {
						if (err) res.send(err);

						if (defender.hp > 0) {
							defender.hp -= attacker.atk - defender.def;
							attacker.exp += Math.sqrt(defender.exp);

							defender.save( function (err) {
								if (err) res.send(err);

								attacker.save ( function (err) {
									if (err) res.send(err);

									res.json(attacker);
								});
							});

						} else {
							res.json({ message: 'Cant attack a dead person'});
						}
					});
				});
			} else {
				res.json({ message: 'Cant attack yourself' });
			}
		});
}