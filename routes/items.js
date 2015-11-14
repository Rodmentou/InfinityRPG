module.exports = function (api, players) {
  api.route('/items')
    .get( function (req, res) {
      res.json({success: true, message: 'Wellcome!'});
    });

}
