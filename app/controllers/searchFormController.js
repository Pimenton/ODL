 angular.module('searchFormController', [])
.controller('searchFormController', ['$scope', 'lispService', function($scope, lispService) {
	
	$scope.querySearch = function($query) {
		var eids = lispService.getAllEids();
		var results = eids.filter(filterItemByaddress($query));
		// TODO: get RLOCS, combine results
		return results;
	}; 	

	var filterItemByaddress = function($query) {
		return function filteraddress($item) {
			return $item.address.startsWith($query);
		};
	};

	$scope.selectedItemChange = function($item) {
		console.log($item);
		$scope.showEidDetails($item);
	};

	var loadEids = function() {
		var eids = [{
		address: "180.188.99.1",
		action: "discard",
		rlocs: [
			{
				address: "11.11.11.11"
			},
			{
				address: "11.11.11.11"
			},
			{
				address: "11.11.11.11"
			},
			{
				address: "11.11.11.11"
			},
			{
				address: "11.11.11.11"
			},
			{
				address: "11.11.11.11"
			},
			{
				address: "11.11.11.12"
			},
			{
				address: "11.11.11.13"
			},
			{
				address: "11.11.11.14"
			}
		]
	},{
		address: "180.188.99.10",
		action: "discard",
		rlocs: [
			{
				address: "11.11.11.11"
			},
			{
				address: "11.11.11.11"
			},
			{
				address: "11.11.11.11"
			},
			{
				address: "11.11.11.11"
			},
			{
				address: "11.11.11.11"
			},
			{
				address: "11.11.11.11"
			},
			{
				address: "11.11.11.12"
			},
			{
				address: "11.11.11.13"
			},
			{
				address: "11.11.11.14"
			}
		]
	},{
		address: "20.188.99.1",
		action: "discard",
		rlocs: [
			{
				address: "11.11.11.11"
			},
			{
				address: "11.11.11.11"
			},
			{
				address: "11.11.11.11"
			},
			{
				address: "11.11.11.11"
			},
			{
				address: "11.11.11.11"
			},
			{
				address: "11.11.11.11"
			},
			{
				address: "11.11.11.12"
			},
			{
				address: "11.11.11.13"
			},
			{
				address: "11.11.11.14"
			}
		]
	},{
		address: "10.188.99.1",
		action: "discard",
		rlocs: [
			{
				address: "11.11.11.11"
			},
			{
				address: "11.11.11.11"
			},
			{
				address: "11.11.11.11"
			},
			{
				address: "11.11.11.11"
			},
			{
				address: "11.11.11.11"
			},
			{
				address: "11.11.11.11"
			},
			{
				address: "11.11.11.12"
			},
			{
				address: "11.11.11.13"
			},
			{
				address: "11.11.11.14"
			}
		]
	}];

	return eids;
	};
 }])
