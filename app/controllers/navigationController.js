 angular.module('navigationController', [])
.controller('navigationController', ['$scope', '$mdSidenav', '$timeout', function($scope, $mdSidenav, $timeout) {
 	
 	$scope.openSideMenu = function() {
 		$mdSidenav('right').open();
 	};
 	$scope.closeSideMenu = function() {
 		$mdSidenav('right').close();
 	};
 	
 	$scope.showEidDetails = function($eid) {
 		$scope.openSideMenu();
 		// CALL LISP MODULE
 		$scope.eid = $eid;
	 	$scope.state = "eid";
 	};
 	$scope.showRlocDetails = function($rloc) {
 		$scope.openSideMenu();
 		$scope.rloc = $rloc;
 	 	$scope.state = "rloc";
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
	$timeout(function () { $scope.showEidDetails(eid); }, false);

 }])
