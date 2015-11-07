var express = require('express'),
	app = express(),
	morgan = require('morgan'),
	bodyParser = require('body-parser'),
	server = require('http').createServer(app),
	CronJob = require('cron').CronJob;

process.env.PORT = 8080;
process.env.env = 'dev';

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


var apiRouter = express.Router();
require('./routes/signup')(apiRouter);
require('./routes/auth')(apiRouter);
//ONLY AUTHENTICATED USERS BEYOND THIS POINT.
require('./routes/middlewares')(apiRouter);
require('./routes/users')(apiRouter);
require('./routes/1x1')(apiRouter);
app.use('/api', apiRouter);

//Increase all users HP
new CronJob('*/10 * * * * *', function() {

}, null, true, 'America/Los_Angeles');






server.listen(port, function () {
	console.log('Server running in ' + env + ' at ' + port + '.');
});
