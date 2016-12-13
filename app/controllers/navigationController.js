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
		nextService.selectVirtualNetwork($scope.selectedVn);
 	};

 	// Show selected node details
 	$scope.showEidDetails = function(eidaddress) {
 		$timeout(function() {
 			$scope.openSideMenu();
 			// Call lisp module to get the eid information
 			var ipaddress = lispService.getIP(eidaddress);
 			$scope.eidVn = lispService.getEidInfo(ipaddress);
 			var rlocsFromEid = lispService.getRLOCsFromEID(ipaddress);
 			$scope.detailMenuState = "eid";
 			$scope.detailVnIds = [];
 			angular.forEach($scope.eidVn, function(value, key) {
 				$scope.detailVnIds.push(key);
 				// TODO: delete if getEidInfo returns a list of xtrids
 				$scope.eidVn[key]["xtrids"] = [$scope.eidVn[key]["xtr_id"]];
 				$scope.eidVn[key]["rlocs"] = rlocsFromEid[key];
 			});
 			if ($scope.selectedVn && $scope.detailVnIds.includes($scope.selectedVn)) {
 				$scope.eid = $scope.eidVn[$scope.selectedVn];
 				$scope.selectedDetailVnId = $scope.selectedVn;
 			} else {
 				$scope.eid = $scope.eidVn[$scope.detailVnIds[0]];
 				$scope.selectedDetailVnId = $scope.detailVnIds[0];
 			}
 			nextService.highlightEid(eidaddress, $scope.selectedDetailVnId);
	 	});
 	};

 	$scope.selectDetailVn = function(selectedDetailVnId) {
 		$scope.eid = $scope.eidVn[selectedDetailVnId];
 	};

 	$scope.showXtrDetails = function(xtrid) {
		$timeout(function() {
	 		$scope.openSideMenu();
	 		$scope.xtr = {
	 			"xtrid": xtrid
	 		};
 			$scope.xtr["eids"]  = lispService.getXTRInfo("EID",xtrid);
 			$scope.xtr["rlocs"]  = lispService.getXTRInfo("RLOC",xtrid);
 			console.log($scope.xtr);
 	 		$scope.detailMenuState = "xtr";
 			nextService.centerOnNode(xtrid, "XTR");
 	 	});
 	};

 	$scope.showRlocDetails = function(rlocid) {
		$timeout(function() {
	 		$scope.openSideMenu();
 			$scope.rloc = lispService.getRlocInfo(rlocid);

 			var eidsFromRloc = lispService.getEIDsFromRLOC(lispService.getIPType($scope.rloc["address_type"]), lispService.getIP($scope.rloc.address));
 			$scope.rloc["eids"] = eidsFromRloc;
 	 		$scope.detailMenuState = "rloc";
 			nextService.centerOnNode(rlocid, "RLOC");
 	 	});
 	};


 	// SELECT VIRTUAL NETWORK

 	$scope.getVnIds = function() {
 		return lispService.getAllVnIds();
 	}

 	$scope.unselectVn = function() {
 		$scope.selectedVn = "all";
 		$scope.selectedVnId = "all";
		nextService.selectVirtualNetwork("all", false);
 	}

 	$scope.selectVn = function(vnId) {
 		$scope.closeSideMenu();
 		$scope.selectedVn = vnId;
		nextService.selectVirtualNetwork(vnId, true);
 	}

 	var showObjectInfo = function(object) {
 		if(object.type == "EID") {
        	$scope.showEidDetails(object.address);
        } else if (object.type == "XTR") {
            $scope.showXtrDetails(object.xtrid);
        } else if (object.type == "RLOC") {
            $scope.showRlocDetails(object.name);
        }
 	};

 	// LISP INITIAL SETUP

 	$scope.finishedLoading = false;
 	$scope.connectionError = false;
 	$scope.finishedLoadingDetail = true;
 	$scope.selectedVn = "all";

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

}])
