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
 	
 	$scope.showEidDetails = function(eidaddress) {
 		$timeout(function() {
 			$scope.openSideMenu();
 			// Call lisp module to get the eid information
 			$scope.eid = lispService.getEidInfo(eidaddress);
 			$scope.detailMenuState = "eid";
	 	});
 	};

 	$scope.showRlocDetails = function(rlocid) {
		$timeout(function() {
	 		$scope.openSideMenu();
 			$scope.rloc = lispService.getRlocInfo(rlocid);
 	 		$scope.detailMenuState = "rloc";
 	 	});
 	};

 	$scope.showTopology = false;
 	$scope.finishedLoading = false;
 	$scope.finishedLoadingDetail = true;

	lispService.initialize().then(
		// success
		function() {
			$scope.finishedLoading = true;
			$scope.showTopology = true;
		}, 
		// failure
		function(error) {
			$scope.finishedLoading = true;

		}
	);

}])
