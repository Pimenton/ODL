 angular.module('lispApi', [])
.controller('apiController', ['$scope', '$http', function($scope, $http) {

	//var deferred = $q.defer();
      var auth64 = btoa('admin:admin');

	$http({
        url: 'http://odl1.cba.upc.edu:8181/restconf/config/odl-mappingservice:mapping-database/',
        method: "GET",
        withCredentials: true,
        headers: {
            'Authorization': 'Basic '+auth64
        }
    })

	.success(function(data) { 
		console.log(data);
	  //deferred.resolve({});
	}).error(function(msg, code) {

	  //deferred.reject(msg);

	  console.log(msg);

	});

	//return deferred.promise;

 }])
