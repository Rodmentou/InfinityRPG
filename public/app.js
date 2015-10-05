var app = angular.module('infinityRPG', ['ngRoute', 'ngCookies']);

app.controller('GameController', function ($scope, $http, $cookies) {
	var cookieToken = $cookies.get('token');
	$scope.nada = '´Hello, damm wordl!';

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
		$http.post('http://localhost:8080/signup', user)
			.then( function (res) {
				console.log(res.data);
			}, function (res) {

			});
	};

	$scope.auth = function (user) {
		$http.post('http://localhost:8080/api/auth', user)
			.then ( function (res) {
				$cookies.put('token', res.data.token);
				$location.path('/play');
				$rootScope.token = res.data.token;
				console.log(res.data);
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