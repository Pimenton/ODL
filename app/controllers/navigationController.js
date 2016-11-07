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

	lispService.initialize().then(
		// success
		function() {

		}, 
		// failure
		function(error) {
			console.log(error);
		}
	);

 }])
