module.exports = function (api, players) {

  api.route('/users')
    .get ( function (req, res) {
      var playersList = players;
      console.log(playersList);
      res.json(playersList);
    });
}
