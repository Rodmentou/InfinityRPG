var app = angular.module('infinityRPG', ['ngRoute', 'ngCookies']);


app.controller('GameController', function ($scope, $http, $cookies) {
	var cookieToken = $cookies.get('token');
	$scope.me = $cookies.get('user');
	console.log($scope.me);

	$scope.getHpBar = function (user) {
		var percentage = (user.hp/user.maxHp)*100 + '%';
		return percentage;
	};

	$scope.getLvl = function (user) {
		return parseInt(Math.sqrt(user.exp));
	};


	$scope.attack = function (user) {
		$http.post('http://localhost:8080/api/1x1', user,
			{ headers: {'x-access-token' : cookieToken } })
			.then ( function (res) {
				console.log(res.data);
				$scope.getPlayers();
			}, function (res) {
				console.log('Error');

			});
	};


	$scope.getMe = function(cookieToken) {
		$http.get('http://localhost:8080/api/users',
			{ headers: {'x-access-token' : cookieToken } })
			.then ( function (res) {
				console.log(res.data);
				$scope.me = res.data;
			}, function (res) {
				console.log('Error fetching data.');
			});
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


	$scope.getPlayers = function() {
		$http.get('http://localhost:8080/api/users',
			{ headers: {'x-access-token' : cookieToken } })
			.then( function (res) {
				$scope.users = (res.data);
				console.log($scope.users);
			}, function (res) {
				console.log('Erro');
		});
	};

	$scope.getMe(cookieToken);
	//$scope.getPlayers();


});

app.controller('FooterController', function ($scope) {

});

app.controller('LoginController', function ($scope, $http, $location, $cookies) {
	var cookieToken = $cookies.get('token');



	$scope.signup = function (user) {
		$http.post('http://localhost:8080/api/signup', user)
			.then( function (res) {
				$cookies.put('token', res.data.username);
				$cookies.put('user', res.data);
				$location.path('/play');
			}, function (res) {

			});
	};

	$scope.auth = function (user) {
		$http.post('http://localhost:8080/api/auth', user)
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
