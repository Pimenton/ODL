 angular.module('searchFormController', [])
.controller('searchFormController', ['$scope', 'lispService', function($scope, lispService) {
	
	$scope.querySearch = function(query) {
		if (!query) return [];
		var results = [];

		var eids = lispService.getAllEids();
		console.log(eids);
		// Search by EID address (cuts the type of address at the beginning of the string)
		for (var i = 0; i < eids.length; i++) {
			if (eids[i]["address"].includes(query))
				results.push({
					id: eids[i]["adress"], 
					nrlocs: eids[i]["rlocs"].length,
					nxtr: eids[i]["xtr_ids"].length,
					type: "eid"
				});
		}

		var xtrids = lispService.getAllxtrids();
		console.log(xtrids);
		// Search by XTR-ID address (cuts the type of address at the beginning of the string)
		for (var i = 0; i < xtrids.length; i++) {
			if (xtrids[i]["xtr_id"].includes(query))
				results.push({
					id: xtrids[i]["xtr_id"], 
					nrlocs: xtrids[i]["rlocs"].length,
					neids: xtrids[i]["eids"].length,
					type: "xtr-id"
				});
		}
		/*angular.forEach(xtrids, function(value, key) {
			if (key.includes(query))
				results.push({
					id: key, 
					rlocs: value,
					type: "xtr-id"
				});
		});*/

		var rlocs = lispService.getAllRLOCs();
		angular.forEach(rlocs, function(value, key) {
			// Filter by RLOC address
			var found = false;
			if (value.rloc.hasOwnProperty("ipv4")) {
			 	if (value.rloc.ipv4.includes(query)) {
					found = true;
					results.push({
						id: key,
						address: value.rloc.ipv4,
						type: "rloc"
					});
				}
			} else {
				if (value.rloc.ipv6.includes(query)) {
					found = true;
					results.push({
						id: key,
						address: value.rloc.ipv4,
						type: "rloc"
					});
				}
			}

			// Filter by RLOC locator-id
			if (!found) {
				if (key.startsWith(query))
					results.push({
						id: key,
						address: value.rloc.ipv4,
						type: "rloc"
					});
			}
		});

		return results;
	}; 	

	var filterItemByaddress = function(query) {
		return function filteraddress(item) {
			return item.address.startsWith(query);
		};
	};

	$scope.selectedItemChange = function(item) {
		if (!item) return;

		if (item.type == "eid") $scope.showEidDetails(item.id);
		else $scope.showRlocDetails(item.id);
	};

	$scope.$watch('detailMenuState', function(newVal, oldVal){
		if (newVal == "") {
			$scope.selectedItem = undefined;
			$scope.searchText = "";
		}
	});

 }])
