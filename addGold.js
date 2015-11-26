module.exports = function (players) {

  var addGold = setInterval ( function () {

    for (var player in players) {
      players[player].gold += 10;
    }

  }, 2000);

}
