var express = require('express'),
	app = express(),
	morgan = require('morgan'),
	bodyParser = require('body-parser'),
	CronJob = require('cron').CronJob,
	forky = require('forky');


var port = process.env.PORT || 8080;
var env = process.env.NODE_ENV || 'dev';


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan(env));
app.use(express.static(__dirname + '/public'));

app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');
  next();
});

var players = {};


var api = express.Router();
require('./routes/signup')(api, players);
//ONLY AUTHENTICATED USERS BEYOND THIS POINT.
require('./routes/middlewares')(api);
require('./routes/items')(api, players);
require('./routes/1x1')(api, players);
require('./routes/users')(api, players);
require('./routes/me')(api, players);

app.use('/api', api);

//Increase all users HP
new CronJob('*/10 * * * * *', function() {
//	console.log(players);
	for (player in players) {
		//console.log(player.hp);
		if (player.maxHp > player.hp) player.hp += 10;
		if (player.hp >= player.maxHp) player.hp = player.maxHp;
		//console.log(players);
	};

}, null, true, 'America/Los_Angeles');






app.listen(port, function () {
	console.log('Server running in ' + env + ' at ' + port + '.');
});
