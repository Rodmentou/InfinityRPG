var app = angular.module('infinityRPG', ['ngRoute', 'ngCookies']);


app.controller('GameController', function ($scope, $http, $cookies, $location) {
	var cookieToken = $cookies.get('token');
	$scope.me = $cookies.get('user');

	$scope.getHpBar = function (user) {
		var percentage = (user.hp/user.maxHp)*100 + '%';
		return percentage;
	};

	$scope.getLvl = function (user) {
		return parseInt(Math.sqrt(user.exp));
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
				$scope.getPlayers();
			}, function (res) {
				console.log('Error on using item');
			});
	};

	$scope.attack = function (user) {
		$http.post('/api/1x1', user,
			{ headers: {'x-access-token' : cookieToken } })
			.then ( function (res) {
				$scope.getPlayers();
				$scope.getMe(cookieToken);
			}, function (res) {
				console.log('Error');
			});
	};

	$scope.upgradeStat = function (stat) {
		$http.post('/api/me/stats', { stat: stat},
			{ headers: {'x-access-token': cookieToken } })
			.then ( function (res) {
				$scope.getMe(cookieToken);
			}, function (res) {
				console.log('Error upgrading stat.');
			})
	};


	$scope.getMe = function(cookieToken) {
		console.log(cookieToken);
		$http.get('/api/me',
			{ headers: {'x-access-token' : cookieToken } })
			.then ( function (res) {
				$scope.me = res.data;
				console.log($scope.me);
				if (!$scope.me) $location.path('/');
			}, function (res) {
				console.log('Error fetching data.');
			});
	};




	$scope.getPlayers = function() {
		$http.get('/api/users',
			{ headers: {'x-access-token' : cookieToken } })
			.then( function (res) {
				$scope.players = res.data;
			}, function (res) {
				console.log('Error fetching players.');
		});
	};

	$scope.getMe(cookieToken);
	$scope.getPlayers();
	var refreshPlayers = setInterval( function(){ $scope.getPlayers(); }, 3000);


});


app.controller('LoginController', function ($scope, $http, $location, $cookies) {

	$scope.signup = function (user) {
		user.password = 123;
		$http.post('/api/signup', user)
			.then( function (res) {
				console.log(res.data);
				$cookies.put('token', res.data.token);
				window.localStorage.setItem('user', JSON.stringify(res.data.user));
				$location.path('/play');
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
