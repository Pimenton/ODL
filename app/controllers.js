// Define the controllers module: all the controllers should be added here as a dependency
angular.module('app.controllers', [
		'navigationController',
		'searchFormController'
	])
    .controller('mainController', ['$scope', function($scope) {
    }])