angular.module('lisp.communication', [])

  // Declaring the lisp service, which will contain all the functions we'll use to communicate with Lisp
  .factory('lispService', ['$http', '$q', function($http, $q) {
    var serviceInstance = {};

    var listOfRlocs = {};
    var RLOCEid = {};
    var EidRLOC = {};

    serviceInstance.getJSON = function(jsonObj) {
      //jsonObj has JSON response 
      var eids = jsonObj["mapping-database"]["virtual-network-identifier"][0]["mapping"];
      for (var i = 0; i<eids.length; i++) {
        var eidInfo = eids[i]["mapping-record"]["eid"];
            var eid_uri =eids[i]["eid"];
        var mappingRecord = eids[i]["mapping-record"];
        var rlocs = mappingRecord["LocatorRecord"];
        var listEidRloc = [];
        for (var rlocIt = 0; rlocIt <rlocs.length; rlocIt++) {
          addRlocToRlocList(rlocs[rlocIt]);
          listEidRloc.push(rlocs[rlocIt]["locator-id"]);
                addRlocToRLOCEid(rlocs[rlocIt],eid_uri);
        }
        EidRLOC[eids[i]["eid-uri"]] = listEidRloc;

        var typeIP = eids[i]["eid-uri"].split(":")[0];
      }
    };

    serviceInstance.addRlocToRlocList = function(rloc){
      //check if rloc exists on listOfRlocs
      listOfRlocs[rloc["locator-id"]] = rloc;
    };

    serviceInstance.getRLOCsFromEID = function (eidUri)
    {
      return EidRLOC[eidUri];
    };

    serviceInstance.getInfoOfRLOC = function (RLOC_ID)
    {
      return listOfRlocs[RLOC_ID];
    };

    serviceInstance.getIPType = function ()
    {
      return eidUri.split(":")[0];
    };

    serviceInstance.getAddressType = function (eidUri)
    {
      return "ietf-lisp-address-types:" + serviceInstance.getIPType(eidUri) + "-afi";
    };

    serviceInstance.getIP = function (eidUri)
    {
      return eidUri.substring(eidUri.split(":")[0].length+1, eidUri.length);
    };

    serviceInstance.getMappingEID = function (eidUri)
    {
      var addresType = serviceInstance.getAddressType(eidUri);
      var idType = serviceInstance.getIPType(eidUri);
      var ip = serviceInstance.getIP(eidUri);
    };

    serviceInstance.addRlocToRLOCEid = function (rloc,eid){
      //check if rloc exists on listOfRlocs
        RLOCEid[rloc["locator-id"]].push(eid);
    };

    serviceInstance.getEIDRLOC = function ()
    {
      var keys = Object.keys(listOfRlocs);
      for (var i = 0; i<keys.count; i++) 
      {
        alert("entro");
      }
    };


    serviceInstance.getAllEids = function() {
		  var deferred = $q.defer();
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
        serviceInstance.getJSON(data);
        deferred.resolve(EidRLOC);
      }).error(function(msg, code) {

        deferred.reject(msg);

        console.log(msg);

      });

      return deferred.promise;

    };

    serviceInstance.getEidInfo = function(eidaddresss){
    	return  {
                  "id": 0,
                  "name": "EID 0",
                  "address": "10.0.0.0",
                  "action": "discard",
                  "rlocs": [
              			{
              				"address": "11.11.11.11"
              			},
              			{
              				"address": "11.11.11.11"
              			},
              			{
              				"address": "11.11.11.11"
              			},
              			{
              				"address": "11.11.11.11"
              			},
              			{
              				"address": "11.11.11.11"
              			},
              			{
              				"address": "11.11.11.11"
              			},
              			{
              				"address": "11.11.11.12"
              			},
              			{
              				"address": "11.11.11.13"
              			},
              			{
              				"address": "11.11.11.14"
              			}
              		]
              };

    }

    return serviceInstance;
  }])