 angular.module('searchFormController', [])
.controller('searchFormController', ['$scope', function($scope) {
	
	$scope.querySearch = function($query) {
		var results = loadEids().filter(filterItemByAdress($query));
		// TODO: get RLOCS, combine results
		return results;
	}; 	

	var filterItemByAdress = function($query) {

		return function filterAdress($item) {
			return $item.adress.startsWith($query);
		};
	};

	var loadEids = function() {
		var eids = [{
		adress: "180.188.99.1",
		action: "discard",
		rlocs: [
			{
				adress: "11.11.11.11"
			},
			{
				adress: "11.11.11.11"
			},
			{
				adress: "11.11.11.11"
			},
			{
				adress: "11.11.11.11"
			},
			{
				adress: "11.11.11.11"
			},
			{
				adress: "11.11.11.11"
			},
			{
				adress: "11.11.11.12"
			},
			{
				adress: "11.11.11.13"
			},
			{
				adress: "11.11.11.14"
			}
		]
	},{
		adress: "180.188.99.10",
		action: "discard",
		rlocs: [
			{
				adress: "11.11.11.11"
			},
			{
				adress: "11.11.11.11"
			},
			{
				adress: "11.11.11.11"
			},
			{
				adress: "11.11.11.11"
			},
			{
				adress: "11.11.11.11"
			},
			{
				adress: "11.11.11.11"
			},
			{
				adress: "11.11.11.12"
			},
			{
				adress: "11.11.11.13"
			},
			{
				adress: "11.11.11.14"
			}
		]
	},{
		adress: "20.188.99.1",
		action: "discard",
		rlocs: [
			{
				adress: "11.11.11.11"
			},
			{
				adress: "11.11.11.11"
			},
			{
				adress: "11.11.11.11"
			},
			{
				adress: "11.11.11.11"
			},
			{
				adress: "11.11.11.11"
			},
			{
				adress: "11.11.11.11"
			},
			{
				adress: "11.11.11.12"
			},
			{
				adress: "11.11.11.13"
			},
			{
				adress: "11.11.11.14"
			}
		]
	},{
		adress: "10.188.99.1",
		action: "discard",
		rlocs: [
			{
				adress: "11.11.11.11"
			},
			{
				adress: "11.11.11.11"
			},
			{
				adress: "11.11.11.11"
			},
			{
				adress: "11.11.11.11"
			},
			{
				adress: "11.11.11.11"
			},
			{
				adress: "11.11.11.11"
			},
			{
				adress: "11.11.11.12"
			},
			{
				adress: "11.11.11.13"
			},
			{
				adress: "11.11.11.14"
			}
		]
	}];

	return eids;
	};
 }])
