var express = require('express'),
	app = express(),
	morgan = require('morgan'),
	bodyParser = require('body-parser'),
	server = require('http').createServer(app),
	CronJob = require('cron').CronJob;

process.env.PORT = 8080;
process.env.NODE_ENV = 'dev';

var port = process.env.PORT;
var env = process.env.NODE_ENV;


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

var players = [];

var api = express.Router();
require('./routes/signup')(api, players);
//ONLY AUTHENTICATED USERS BEYOND THIS POINT.
require('./routes/middlewares')(api);
require('./routes/1x1')(api, players);
app.use('/api', api);

//Increase all users HP
new CronJob('*/10 * * * * *', function() {
	console.log(players);
	for (var i = 0; i < players.length; i++) {
		if (players[i].maxHp > players[i].hp) players[i].hp += 10;
		if (players[i].hp >= players[i].maxHp) players[i].hp = players[i].maxHp;
		//console.log(players);
	};

}, null, true, 'America/Los_Angeles');






server.listen(port, function () {
	console.log('Server running in ' + env + ' at ' + port + '.');
});
