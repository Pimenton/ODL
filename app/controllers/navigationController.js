 angular.module('navigationController', [])
.controller('navigationController', ['$scope', '$mdSidenav', '$timeout', 'lispService', function($scope, $mdSidenav, $timeout, lispService) {
 	
 	$scope.openSideMenu = function() {
 		$mdSidenav('right').open();
 	};
 	
 	$scope.closeSideMenu = function() {
 		$mdSidenav('right')
 			.close()
 			.then(function(){
 				$scope.detailMenuState = "";
 			});
 	};
 	
 	$scope.showEidDetails = function($eid) {
 		$timeout(function() {
 			$scope.openSideMenu();
 			// CALL LISP MODULE
 			$scope.eid = lispService.getEidInfo($eid);
	 		$scope.detailMenuState = "eid";
	 	});
 	};
 	$scope.showRlocDetails = function($rloc) {
		$timeout(function() {
	 		$scope.openSideMenu();
 			$scope.rloc = $rloc;
 	 		$scope.detailMenuState = "rloc";
 	 	});
 	};

	eids = {
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
	};

	rloc = {
		address: "1.1.1.1",
		priority: 2,
		weight: 10,
		eids: [
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
	};

	lispService.getAllEids().then(
		// success
		function(response) {
			console.log(response);
		}, 
		// failure
		function(error) {
			console.log(error);
		}
	);
	//$timeout(function () { $scope.showRlocDetails(rloc); }, false);

 }])
