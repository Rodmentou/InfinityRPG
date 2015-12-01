module.exports = function (players, interval, amount) {

  var addHp = setInterval ( function () {
    for (var player in players) {
      var thisPlayer = players[player];
      (thisPlayer.hp < thisPlayer.maxHp) ? //Uggly
         thisPlayer.hp += amount :             //Uggly
         thisPlayer.hp = thisPlayer.maxHp; //Uggly
    }
  }, interval);
}
