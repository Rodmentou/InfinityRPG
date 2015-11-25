module.exports = function (api, players) {

	api.route('/1x1')
		.post( function (req, res) {
			var attackerName = req.decoded.username;
			var defenderName = req.body.username;

			if (attackerName != defenderName) { //Are you the same person?
				console.log(attackerName != defenderName);
				if ( (players[attackerName]) && (players[defenderName]) ) {

						var attacker = players[attackerName];
						var defender = players[defenderName];

						var attackerLvl = Math.sqrt(attacker.exp);
						var defenderLvl = Math.sqrt(attacker.exp);

						var attackerDex = (attacker.stats.dex*3 - attackerLvl)/10;
						(attackerDex > 0) ? function(){} : attackerDex = 0.4;
						(attackerDex > 1) ? attackerDex = 1 : function() {};
						var attackerStr = attacker.stats.str;
						var attackerInt = attacker.stats.int;

						var defenderDex = (defender.stats.dex*3 - defenderLvl)/10;
						(defenderDex > 0) ? function(){} : defenderDex = 0.4;
						(defenderDex > 1) ? defenderDex = 1 : function() {};
						var defenderStr = defender.stats.str;
						var defenderInt = defender.stats.int;

						var attackerDmg = ( (attackerStr - defenderStr)
															+ (attackerInt - defenderInt) * 2) * attackerDex + 1;
						var defenderDmg = ( (defenderStr - attackerStr)
															+ (defenderInt - attackerInt) * 2) * defenderDex + 1;


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

							(attacker) ? res.json({attacker:attacker, defender: defender})
												 : res.json({success: true, message: 'You are dead.'});

					} else {
						res.json({ success: false, message: 'Cant attack nothing.' });
					}
				} else {
					res.json({ success: false, message: 'Cant attack yourself.'});
				}

		});
}
