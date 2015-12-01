var app = angular.module('infinityRPG', ['ngRoute', 'ngCookies']);


app.controller('GameController', function ($scope, $http, $cookies, $location) {
	var cookieToken = $cookies.get('token');
	$scope.me = $cookies.get('user');

	$scope.getHpBar = function (user) {
		var percentage = (user.hp/user.maxHp)*100 + '%';
		return percentage;
	};

	$scope.getLvl = function (user) {
		if (user) {
				return parseInt(Math.sqrt(user.exp));
		}
	};

	$scope.getPointsLeft = function(user) {
		if (user) {
			var left = (Math.sqrt(user.exp) + 5 - user.stats.pointsUsed);
			(left >= 0) ? function(){} : left = 0;
			return left;
		}
	};

	$scope.getBarClass = function (user) {
		if (user.hp/user.maxHp > 0.6) {
			return 'progress-bar-info';
		} else if (user.hp/user.maxHp > 0.3) {
			return 'progress-bar-warning';
		} else {
			return 'progress-bar-danger';
		}
	};

	$scope.useItem = function ( itemName ) {
		$http.get('/api/items/use/' + itemName,
			{ headers: { 'x-access-token' : cookieToken } })
			.then( function (res) {
				var player = res.data.player;
				$scope.me = player;
				$scope.players[player.username] = player;
			}, function (res) {
				console.log('Error on using item');
			});
	};

	$scope.attack = function (user) {
		if ($scope.attacking) {
			console.log('Attacking');
			$scope.error = 'Wait!';
		} else {
			$scope.attacking = true;
			var defender = {};
			defender.username = user.username;

			if (defender.username != $scope.me.username) {
				$http.post('/api/1x1', defender,
					{ headers: {'x-access-token' : cookieToken } })
					.then ( function (res) {
						$scope.attacking = false;
						if (res.data.attacker) {
							var attackerName = res.data.attacker.username;
							var defenderName = res.data.defender.username;

							$scope.me = res.data.attacker;
							$scope.players[attackerName] = res.data.attacker;
							(res.data.defender.hp < 0)
								?	delete $scope.players[defenderName]
								: $scope.players[defenderName] = res.data.defender;
						} else { //ATTACKER DIED
							console.log(res.data);

							$location.path('/');

						}

					}, function (res) { //ERROR RESPONSE
						$scope.attacking = false;
						console.log('Error on attack.');
					});

			} else { //ATTACKING SELF
				$scope.attacking = false;
				console.log("Can't attack yourself!");
			}
		}
	};

	$scope.upgradeStat = function (stat) {
		$http.post('/api/me/stats', { stat: stat, amount: 10},
			{ headers: {'x-access-token': cookieToken } })
			.then ( function (res) {
				if (res.data.player) $scope.me = res.data.player;
			}, function (res) {
				console.log('Error upgrading stat.');
			})
	};


	$scope.getMe = function(cookieToken) {
		$http.get('/api/me',
			{ headers: {'x-access-token' : cookieToken } })
			.then ( function (res) {
				$scope.me = res.data;
				if (!$scope.me) $location.path('/');
			}, function (res) {
				console.log('Error fetching data.');
			});
	};




	$scope.getPlayers = function() {
		$http.get('/api/players',
			{ headers: {'x-access-token' : cookieToken } })
			.then( function (res) {
				$scope.players = res.data;
			}, function (res) {
				console.log('Error fetching players.');
		});
	};

	$scope.getMe(cookieToken);
	$scope.getPlayers();
	setInterval( function(){ $scope.getPlayers(); }, 30000);



});


app.controller('LoginController', function ($scope, $http, $location, $cookies) {

	$scope.signup = function (user) {
		$http.post('/api/signup', user)
			.then( function (res) {
				if (res.data.token) {
					$cookies.put('token', res.data.token);
					window.localStorage.setItem('user', JSON.stringify(res.data.user));
					$location.path('/play');
				} else {
					delete $scope.user.username;
					delete $scope.user.password;
					$scope.error = 'Error on login';
				}

			}, function (res) {
				console.log('Error on signup');
			});
	};

	$scope.auth = function (user) {
		$http.post('/api/auth', user)
			.then ( function (res) {
				if (res.data.token){
					$cookies.put('token', res.data.token);
					$location.path('/play');
				}

			}, function (res) {
				$scope.error = 'Error on login.';
			});
	};


});




app.config( function ($routeProvider, $locationProvider) {
	$routeProvider
		.when('/',
		{
			controller: 'LoginController',
			templateUrl: 'partials/login.html'
		})

		.when('/play',
		{
			controller: 'GameController',
			templateUrl: 'partials/game.html'
		})

		.when ('/signup',
		{
			controller: 'SignupController',
			templateUrl: 'partials/signup.html'
		})
		.otherwise(
		{
			redirectTo: '/'
		});

});
