module.exports = function (api, players) {

  api.route('/users')
    .get ( function (req, res) {

      res.json(players);
    });
}
