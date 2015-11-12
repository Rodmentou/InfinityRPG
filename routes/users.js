module.exports = function (api, players) {

  api.route('/users')
    .get ( function (req, res) {
      console.log(players);
      console.log( typeof(players) );
      res.json(players);
    });
}
