module.exports = function (players, interval, amount) {

  setInterval ( function () {
    for (var player in players) {
      players[player].gold += amount;
    }
  }, interval);

}
