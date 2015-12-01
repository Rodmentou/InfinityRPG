module.exports = function (players, interval) {

  var botIndex = 0;
  var createBot = setInterval( function(){
  	var botNumber;
  	(botIndex > 9) ? botNumber = botIndex : botNumber = '0' + botIndex;
  	var botName = "_Bot " + botNumber;
  	if (!players[botName]) {
  		players[botName] = {
  				username: botName,	maxHp: 200,hp: 200, exp: Math.pow(botIndex, 2),
  				def: 10,atk: 10,gold: botIndex*5, stats: {str:
  					botIndex, int: botIndex, dex: botIndex,pointsUsed: 0}};
  	} else {
  		var stats = players[botName].stats;
  		stats.str += 1;
  		stats.int += 1;
  		stats.dex += 1;
  	};
  		botIndex++;

  		if (botIndex >= 100) botIndex = 0;
  }, interval);


}
