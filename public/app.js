var app = angular.module('infinityRPG', ['ngRoute', 'ngCookies']);

app.controller('GameController', function ($scope, $http, $cookies) {
	var cookieToken = $cookies.get('token');
	$scope.nada = cookieToken;

	$scope.logout = function () {
		$cookies.remove('token');

	};

	$scope.getHpBar = function (user) {
		var percentage = user.hp/user.maxHp + '00%';
		return percentage;
	};

	$scope.attack = function (user) {
		$http.post('http://localhost:8080/api/1x1', 
			{ headers: {'x-acess-token' : cookieToken } })
			.then ( function (res) {

			}, function (res) {

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


	$http.get('http://localhost:8080/api/users',
		{ headers: {'x-access-token' : cookieToken } })
		.then( function (res) {
			$scope.users = res.data;
		}, function (res) {
	});



});

app.controller('LoginController', function ($scope, $http, $location, $cookies) {
	var cookieToken = $cookies.get('token');
	if (cookieToken) {

		$location.path('/play');
	};


	$scope.signup = function (user) {
		$http.post('http://localhost:8080/api/signup', user)
			.then( function (res) {
				$scope.auth(user);
			}, function (res) {

			});
	};

	$scope.auth = function (user) {
		$http.post('http://localhost:8080/api/auth', user)
			.then ( function (res) {
				$cookies.put('token', res.data.token);
				$location.path('/play');
			}, function (res) {

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