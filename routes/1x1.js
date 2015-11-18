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

						var attackerDex = (attacker.stats.dex - attackerLvl - 1)/10;
						var defenderDex = (defender.stats.dex - defenderLvl - 1)/10;

						var attackerStrMod = Math.random() * (attackerDex - 0.6) + 0.6;
						var attackerIntMod = Math.random() * (attackerDex - 0.3) + 0.3;
						var defenderStrMod = Math.random() * (defenderDex - 0.6) + 0.6;
						var defenderIntMod = Math.random() * (defenderDex - 0.3) + 0.3;

						var attackerDmg = ( (attacker.stats.str - defender.stats.str) * attackerStrMod
															+ (attacker.stats.int - defender.stats.int) * attackerIntMod * 2) + 1;
						var defenderDmg = ( (defender.stats.str - attacker.stats.str) * defenderStrMod
															+ (defender.stats.int - attacker.stats.int) * defenderIntMod * 2) + 1;
						console.log(attackerDmg);
						console.log(defenderDmg);


						if (attackerDmg > defenderDmg) { //Award gold to the highest dmg.
							attacker.gold += (defender.gold/10);
							defender.gold -= (defender.gold/10);
						} else {
							defender.gold += (attacker.gold/10);
							attacker.gold -= (attacker.gold/10);
						};

						(defenderDmg > 0) ? attacker.hp -= defenderDmg : attacker.hp --;
						attacker.exp += defenderLvl;

						(attackerDmg > 0) ? defender.hp -= attackerDmg : defender.hp --;
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
