module.exports = function (players) {

  var addHp = setInterval ( function () {
    for (var player in players) {
      var thisPlayer = players[player];
      (thisPlayer.hp < thisPlayer.maxHp) ? //Uggly
         thisPlayer.hp += 10 :             //Uggly
         thisPlayer.hp = thisPlayer.maxHp; //Uggly
    }
  }, 30000);
}
