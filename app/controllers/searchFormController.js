 angular.module('searchFormController', [])
.controller('searchFormController', ['$scope', 'lispService', function($scope, lispService) {
	
	$scope.querySearch = function(query) {
		if (!query) return [];

		var eids = lispService.getAllEIDs();
		var results = [];
		angular.forEach(eids, function(value, key) {
			// Search by EID address (cuts the type of address at the beginning of the string)
			if (key.substr(5).startsWith(query))
				results.push({
					address: key, 
					rlocs: value,
					type: "eid"
				});
		});

		var rlocs = lispService.getAllRLOCs();
		angular.forEach(rlocs, function(value, key) {
			// Filter by RLOC address
			var found = false;
			if (value.rloc.hasOwnProperty("ipv4")) {
			 	if (value.rloc.ipv4.startsWith(query)) {
					found = true;
					results.push({
						id: key,
						address: value.rloc.ipv4,
						type: "rloc"
					});
				}
			} else {
				if (value.rloc.ipv6.startsWith(query)) {
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

		//return [{number: 1},{number: 2},{number: 3},{number: 45}];
		return results;
	}; 	

	var filterItemByaddress = function(query) {
		return function filteraddress(item) {
			return item.address.startsWith(query);
		};
	};

	$scope.selectedItemChange = function(item) {
		if (!item) return;

		if (item.type == "eid") $scope.showEidDetails(item.address);
		else $scope.showRlocDetails(item.id);
	};

	$scope.$watch('detailMenuState', function(newVal, oldVal){
		if (newVal == "") {
			$scope.selectedItem = undefined;
			$scope.searchText = "";
		}
	});

 }])
