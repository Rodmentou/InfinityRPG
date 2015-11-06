module.exports = function (apiRouter) {
	var User = require('../public/models/user');

	apiRouter.route('/1x1')
		.post( function (req, res) {
			if (req.decoded._id != req.body._id) { //Are you the same person?
				User.findById (req.decoded._id, function (err, attacker) {

					attacker.hp -= 1000;
					attacker.save ( function (err) {

					});

					User.findById(req.body._id, function (err, defender) {
						var attackerDmgDealt = 0;
						var defenderDmgDealt = 0;

						for (var i=0; i<10; i++) {
							attackerDmgDealt += attacker.atk - defender.def;
							defenderDmgDealt += defender.atk - attacker.def;
						};
						console.log(attacker.hp);
						attacker.hp -= defenderDmgDealt;
						console.log(attacker.hp);
						console.log(attacker);
						attacker.save( function (err) {	
							return true;
						});
						defender.hp -= attackerDmgDealt;
						defender.save( function (err) {
							return true;
								//if (err) res.send(err);	
						});
						res.json(attacker);

					});
				});

			} else {
				res.json({ message: 'Cant attack yourself' });
			}
		});
}