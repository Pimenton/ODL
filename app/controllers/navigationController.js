 angular.module('navigationController', [])
.controller('navigationController', ['$scope', '$mdSidenav', '$timeout', function($scope, $mdSidenav, $timeout) {
 	
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
 		$scope.openSideMenu();
 		// CALL LISP MODULE
 		$scope.eid = $eid;
	 	$scope.detailMenuState = "eid";
 	};
 	$scope.showRlocDetails = function($rloc) {
 		$scope.openSideMenu();
 		$scope.rloc = $rloc;
 	 	$scope.detailMenuState = "rloc";
 	};

	eid = {
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
	};

	rloc = {
		adress: "1.1.1.1",
		priority: 2,
		weight: 10,
		eids: [
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
	};
	$timeout(function () { $scope.showRlocDetails(rloc); }, false);

 }])
