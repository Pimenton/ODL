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
 		if ($scope.detailMenuState == "eid") $scope.eid = $scope.eidVn[selectedDetailVnId];
 		else if ($scope.detailMenuState == "xtr") $scope.xtr["info"] = $scope.xtrVn[selectedDetailVnId];
 	};

 	$scope.showXtrDetails = function(xtrid) {
		$timeout(function() {
	 		$scope.openSideMenu();
	 		$scope.xtr = {
	 			"xtrid": xtrid
	 		};
	 		$scope.xtrVn = {};
 			$scope.xtrVn["eids"]  = lispService.getXTRInfo("EID",xtrid);
 			$scope.xtrVn["rlocs"]  = lispService.getXTRInfo("RLOC",xtrid);
 			
 	 		$scope.detailMenuState = "xtr";
 	 		$scope.detailVnIds = [];
 	 		for (var i = 0; i < $scope.xtrVn["eids"].length; i++) {
 	 			if ($scope.xtrVn["eids"][i]["info"].length != 0 && $scope.xtrVn["rlocs"][i]["info"].length != 0) {
	 	 			var vnId = $scope.xtrVn["eids"][i]["vni"];
	 	 			$scope.detailVnIds.push(vnId);
	 	 			$scope.xtrVn[vnId] = {};
	 	 			$scope.xtrVn[vnId]["eids"] = $scope.xtrVn["eids"][i]["info"];
	 	 			$scope.xtrVn[vnId]["rlocs"] = $scope.xtrVn["rlocs"][i]["info"];
 	 			}
 	 		}
 			if ($scope.selectedVn && $scope.detailVnIds.includes($scope.selectedVn)) {
 				$scope.xtr["info"] = $scope.xtrVn[$scope.selectedVn];
 				$scope.selectedDetailVnId = $scope.selectedVn;
 			} else {
 				$scope.xtr["info"] = $scope.xtrVn[$scope.detailVnIds[0]];
 				$scope.selectedDetailVnId = $scope.detailVnIds[0];
 			}
 			console.log($scope.xtr);
 			console.log($scope.xtrVn);
 			console.log($scope.detailVnIds);
 			nextService.centerOnNode(xtrid, "XTR");
 	 	});
 	};

 	$scope.showRlocDetails = function(rlocid) {
		$timeout(function() {
	 		$scope.openSideMenu();
 			$scope.rloc = lispService.getRlocInfo(rlocid);

 			var eidsFromRloc = lispService.getEIDsFromRLOC(lispService.getIPType($scope.rloc["address_type"]), lispService.getIP($scope.rloc.address));
 			console.log(eidsFromRloc);
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
