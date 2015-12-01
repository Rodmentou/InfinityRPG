module.exports = function (api, players) {

  api.route('/players')
    .get ( function (req, res) {
      res.json(players);
    });
}
