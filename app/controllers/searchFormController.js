 angular.module('searchFormController', [])
.controller('searchFormController', ['$scope', 'lispService', 'nextService', function($scope, lispService, nextService) {
	
	$scope.querySearch = function(query) {
		if (!query) return [];
		var results = [];

		var eids = lispService.getAllEids();
		// Search by EID address 
		for (var i = 0; i < eids.length; i++) {
			if (eids[i]["address"].includes(query))
				results.push({
					id: eids[i]["address"], 
					nrlocs: eids[i]["rlocs"].length,
					nxtr: eids[i]["xtr_id"].length,
					type: "eid"
				});
		}

		var xtrids = lispService.getAllxtrids();
		// Search by XTR-ID  
		angular.forEach(xtrids, function(value, key) {
			if (key.includes(query))
				results.push({
					id: key, 
					nrlocs: Object.keys(value).length,
					type: "xtr"
				});
		});

		var rlocs = lispService.getAllRlocs();
		angular.forEach(rlocs, function(value, key) {
			// Filter by RLOC address
			var found = false;
		 	if (value["address"].includes(query)) {
		 		found = true;
				results.push({
						id: key,
						address: value["address"],
						type: "rloc"
					});
			}
			
			// Filter by RLOC locator-id
			if (!found) {
				if (key.includes(query))
					results.push({
						id: key,
						address: value["address"],
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

		$scope.unselectVn();

		if (item.type == "eid") $scope.showEidDetails(item.id);
		else if (item.type == "xtr") $scope.showXtrDetails(item.id);
		else $scope.showRlocDetails(item.id);
	};

	$scope.$watch('detailMenuState', function(newVal, oldVal){
		if (newVal == "") {
			$scope.selectedItem = undefined;
			$scope.searchText = "";
		}
	});

 }])
