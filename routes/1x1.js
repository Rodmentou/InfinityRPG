var	mongoose = require('mongoose');
var UserModel = require('../models/user');

module.exports = function (api, players) {

	api.route('/1x1')
		.post( function (req, res) {
			var attackerName = req.decoded.username;
			var defenderName = req.body.username;

			if (attackerName != defenderName) { //Are you the same person?
				if ( (players[attackerName]) && (players[defenderName]) ) {
						var attacker = players[attackerName];
						var defender = players[defenderName];

						var dmg = calculateDmg(attacker, defender);

						var battle = function (dmg, attacker, defender) {
							//Some calculations using dmg.attacker and dmg.defender.
						}

						var battle = function (attacker, defender) {
							//Some calculations using attacker.dmg and defender.dmg.
							delete attacker.dmg;
							delete defender.dmg;
						}


						var attackerDmg = dmg.attackerDmg;
						var defenderDmg = dmg.defenderDmg;
						var attackerLvl = Math.sqrt(attacker.exp);
						var defenderLvl = Math.sqrt(attacker.exp);



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
							updateMaxLevel(defender, defenderLvl);
							delete players[defenderName];
						};

						if (attacker.hp <= 0) {
							if (defender) {
								defender.exp += attackerLvl;
								defender.gold += attacker.gold;
							}
							updateMaxLevel(attacker, attackerLvl);
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

		var updateMaxLevel = function (player, maxLevel) {
			if (!player.isBot) {
				if (player.maxLevel < maxLevel) {
					var username = player.username;
					UserModel.update({ username: username},
													{maxLevel: maxLevel},
					function(err, numDocs) {
						if (err) console.log(err);
					});
				}
			}
		}

		var calculateDmg = function (attacker, defender) {
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
			return ({attackerDmg: attackerDmg, defenderDmg: defenderDmg});
		}
}
