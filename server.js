var express = require('express'),
	app = express(),
	morgan = require('morgan'),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	server = require('http').createServer(app),
	io = require('socket.io')(server),
	passport = require('passport'),
	CronJob = require('cron').CronJob,
	jwt = require('jsonwebtoken');


var config = require('./config');

var port = process.env.PORT || config.serverPort;
var env = process.env.NODE_ENV || config.serverEnv;
var jwtSecret = config.jwtSecret;
var dbUrl = config.dbUrl;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan(env));
app.use(express.static(__dirname + '/public'));
app.use(passport.initialize());
app.use(passport.session());

app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');
  next();
});


mongoose.connect(dbUrl);




var apiRouter = express.Router();
require('./routes/signup')(apiRouter);
require('./routes/auth')(apiRouter);
//ONLY AUTHENTICATED USERS BEYOND THIS POINT.
require('./routes/middlewares')(apiRouter);
require('./routes/users')(apiRouter);
require('./routes/1x1')(apiRouter);
app.use('/api', apiRouter);

var User = require('./public/models/user');
//Increase all users HP
new CronJob('*/10 * * * * *', function() {
  User.update( {}, 
  	{ $inc: { hp: 10 } }, {multi: true}, function () {
  		console.log("Refresh free");
  	});
}, null, true, 'America/Los_Angeles');






server.listen(port, function () {
	console.log('Server running in ' + env + ' at ' + port + '.');
});