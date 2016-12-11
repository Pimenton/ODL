angular.module('navigationController', [])
.controller('navigationController', ['$scope', '$mdSidenav', '$timeout', 'lispService', 'nextService', function($scope, $mdSidenav, $timeout, lispService, nextService) {

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
 			$scope.eidVn = lispService.getEidInfo(eidaddress);
 			$scope.detailMenuState = "eid";
 			$scope.detailVnIds = [];
 			angular.forEach($scope.eidVn, function(key, value) {
 				$scope.detailVnIds.push(key);
 			});
 			if ($scope.selectedVn && $scope.detailVnIds.includes($scope.selectedVn)) {
 				$scope.eid = $scope.eidVn[$scope.selectedVn];
 			} else {
 				$scope.eid = $scope.eidVn[$scope.detailVnIds[0]];
 			}
	 	});
 	};

 	$scope.selectDetailVn = function(selectedDetailVnId) {
 		$scope.eid = $scope.eidVn[selectedDetailVnId];
 	};

 	$scope.showXtrDetails = function(xtrid) {
		$timeout(function() {
	 		$scope.openSideMenu();
 			$scope.xtrid = lispService.getXtridInfo(xtrid);
 	 		$scope.detailMenuState = "xtrid";
 	 	});
 	};

 	$scope.showRlocDetails = function(rlocid) {
		$timeout(function() {
	 		$scope.openSideMenu();
 			$scope.rloc = lispService.getRlocInfo(rlocid);
 	 		$scope.detailMenuState = "rloc";
 	 	});
 	};


 	// SELECT VIRTUAL NETWORK

 	$scope.getVnIds = function() {
 		return lispService.getAllVnIds();
 	}

 	$scope.selectVn = function(vnId) {
 		$scope.selectedVn = vnId;
		nextService.selectVirtualNetwork(vnId);
 	}

 	var showObjectInfo = function(object) {
 		if(object.type == "EID") {
        	$scope.showEidDetails(object.address);
        } else if (object.type == "XTR-ID") {
            $scope.showXtridDetails(object.address);
        } else if (object.type == "RLOC") {
            $scope.showRlocDetails(object.name);
        }
 	};

 	// LISP INITIAL SETUP

 	$scope.finishedLoading = false;
 	$scope.connectionError = false;
 	$scope.finishedLoadingDetail = true;

 	// Load data from lisp service, then replace loading indicator
	lispService.initialize().then(
		// success
		function() {
			$scope.finishedLoading = true;
			topologyContainer = document.getElementById("topology-container");
			nextService.initTopology(topologyContainer, showObjectInfo);
		},
		// failure
		function(error) {
			$scope.finishedLoading = true;
			$scope.connectionError = true;
		}
	);

	//$scope.showEi("");

}])
