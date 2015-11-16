module.exports = function (api, players) {

	api.route('/1x1')
		.post( function (req, res) {
			var attackerName = req.decoded.username;
			var defenderName = req.body.username;

			if (attackerName != defenderName) { //Are you the same person?
				if ( (players[attackerName]) && (players[defenderName]) ) {

						var attacker = players[attackerName];
						var defender = players[defenderName];
						var attackerLvl = Math.sqrt(attacker.exp);
						var defenderLvl = Math.sqrt(attacker.exp);
						var attackerDmg = attacker.atk - defender.def;
						var defenderDmg = defender.atk - attacker.def;


						(attackerDmg > defenderDmg) ? //Award gold to the highest dmg.
							attacker.gold += (defender.gold/10) :
							defender.gold += (attacker.gold/10);

						attacker.hp -= defenderDmg;
						attacker.exp += defenderLvl;

						defender.hp -= attackerDmg;
						defender.exp += attackerLvl;

						if (defender.hp <= 0) {
							attacker.exp += defenderLvl;
							attacker.gold += defender.gold;
							delete players[defenderName];
						};

						if (attacker.hp <= 0) {
							if (defender) defender.exp += attackerLvl;
							delete players[attackerName];
						};

							(attacker) ? res.json(attacker) : res.json({message: 'You are dead.'});

					} else {
						res.json({ success: false, message: 'Cant attack nothing.' });
					}
				} else {
					res.json({ success: false, message: 'Cant attack yourself.'});
				}

		});
}
