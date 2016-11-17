angular.module('navigationController', [])
.controller('navigationController', ['$scope', '$mdSidenav', '$timeout', 'lispService', function($scope, $mdSidenav, $timeout, lispService) {
 	
 	// SIDE MENU

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
 	
 	// Show selected node details
 	$scope.showEidDetails = function(eidaddress) {
 		$timeout(function() {
 			$scope.openSideMenu();
 			// Call lisp module to get the eid information
 			$scope.eid = lispService.getEidInfo(eidaddress);
 			$scope.detailMenuState = "eid";
	 	});
 	};

 	$scope.showXtrDetails = function(xtrid) {
		$timeout(function() {
	 		$scope.openSideMenu();
 			$scope.xtrid = lispService.getXtridInfo(xtrid);
 	 		$scope.detailMenuState = "xtr-id";
 	 	});
 	};

 	$scope.showRlocDetails = function(rlocid) {
		$timeout(function() {
	 		$scope.openSideMenu();
 			$scope.rloc = lispService.getRlocInfo(rlocid);
 	 		$scope.detailMenuState = "rloc";
 	 	});
 	};


 	// SELECT

 	$scope.getVnIds = function() {
 		return ["1.1.1.1","2.2.2.2"];
 	}

 	$scope.selectVn = function(vnId) {
 		// WORKS
 	}


 	// LISP INITIAL SETUP

 	$scope.showTopology = false;
 	$scope.finishedLoading = false;
 	$scope.finishedLoadingDetail = true;

 	// Load data from lisp service, then replace loading indicator
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

	$scope.showXtrDetails("");

}])
