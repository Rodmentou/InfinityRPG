
module.exports = function (api, players) {
  require('./signup')(api, players);
  //ONLY AUTHENTICATED USERS BEYOND TFHIS POINT.
  require('./middlewares')(api);
  require('./items')(api, players);
  require('./1x1')(api, players);
  require('./players')(api, players);
  require('./me')(api, players);

}
