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
 	
 	$scope.showEidDetails = function(eid) {
 		$timeout(function() {
 			$scope.openSideMenu();
 			// Call lisp module to get the eid information
 			// $scope.eid = lispService.getEidInfo(eid);
 			$scope.eid = lispService.getEidInfo("ipv4:1.1.1.1");
	 		$scope.detailMenuState = "eid";
	 	});
 	};

 	$scope.showRlocDetails = function(rloc) {
		$timeout(function() {
	 		$scope.openSideMenu();
 			$scope.rloc = rloc;
 	 		$scope.detailMenuState = "rloc";
 	 	});
 	};

 	$scope.finishedLoading = false;

	lispService.initialize().then(
		// success
		function() {
			$scope.finishedLoading = true;
			console.log("Api call succeded");
		}, 
		// failure
		function(error) {
			console.log(error);
		}
	);

}])
