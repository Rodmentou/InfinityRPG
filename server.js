var express = require('express'),
	app = express(),
	morgan = require('morgan'),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	server = require('http').createServer(app),
	io = require('socket.io')(server),
	passport = require('passport'),
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
var User = require('./public/models/user');


var apiRouter = express.Router();

app.post('/signup', function (req, res) {
	var user = new User();

	user.name = req.body.name;
	user.username = req.body.username;
	user.password = req.body.password;

	user.save( function (err) {
		if (err) {
			if (err.code == 11000) {
				return res.json({ success: false, message: 'User already exists'});
			} else { return res.send(err) }
		}
		res.json({ message: 'User created'});
	});
});

apiRouter.post('/auth', function (req, res) {
	User.findOne( {
		username: req.body.username
	}).select('name username password').exec( function (err, user) {
		if (err) throw err;

		if (!user) {
			res.json({
				success: false,
				message: 'User not found'
			});
		} else if (user) {
			var validPassword = user.comparePassword(req.body.password);
			if (!validPassword) {
				res.json( {
					success: false,
					message: 'Wrong password.'
				});
			} else {
				var token = jwt.sign({
					name: user.name,
					username: user.username
				}, jwtSecret, {
					expiresIn: 3000
				});

				res.json({
					success: true,
					message: 'Token created',
					token: token
				});
			}
		}
	});	
});



//ONLY AUTHENTICATED USERS BEYOND THIS POINT.
apiRouter.use( function (req, res, next) {
	var token = req.body.token || req.headers['x-access-token'];

	if (token) {
		jwt.verify(token, jwtSecret, function (err, decoded) {
			if (err) {
				console.log(err);
				return res.status(403).send({
					success: false,
					message: 'Auth failed'
				});
			} else {
				req.decoded = decoded;

				next();
			}
		});

	} else {
		return res.status(403).send({
			success: false,
			message: 'Token needed.'
		});
	}

});


apiRouter.route('/users')

	.post( function (req, res) {
		var user = new User();

		user.name = req.body.name;
		user.username = req.body.username;
		user.password = req.body.password;

		user.save( function (err) {
			if (err) {
				if (err.code == 11000) {
					return res.json({ success: false, message: 'User already exists'});
				} else { return res.send(err) }
			}
			res.json({ message: 'User created'});
		});
	})

	.get( function (req, res) {
		User.find( function (err, users) {
			if (err) res.send(err);

			res.json(users);
	});
});

apiRouter.route('/users/:user_id')
	.get( function (req, res) {
		User.findById( req.params.user_id, function (err, user) {
			if (err) res.send (err);
			res.json(user);
		});
	})

	.put( function (req, res) {
		User.findById(req.params.user_id, function (err, user) {
			if (err) res.send(err);

			if (req.body.name) user.name = req.body.name;
			if (req.body.username) user.username = req.body.username;
			if (req.body.password) user.password = req.body.password;

			user.save( function (err){
				if (err) send (err);
				res.json({message: 'User updated'});
		});
	})

	.delete( function (req, res) {
		console.log(req.params);
		User.remove({
			_id: req.params.user_id
		}, function (err, user) {
			if (err) return res.send(err);
			res.json({ message: 'Deleted' });
		});
	});
});

apiRouter.get('/me', function (req, res) {
	res.send(req.decoded);
});


apiRouter.get('/', function (req, res) {
	res.json( {message: 'Landing page.'});
});

app.use('/api', apiRouter);






server.listen(port, function () {
	console.log('Server running in ' + env + ' at ' + port + '.');
});