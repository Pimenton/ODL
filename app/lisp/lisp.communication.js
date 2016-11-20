angular.module('lisp.communication', [])

  // Declaring the lisp service, which will contain all the functions we'll use to communicate with Lisp
  .factory('lispService', ['$http', '$q', function($http, $q) {
    var serviceInstance = {};

    // Info of all rlocs
    var listOfRlocs = {};
    // Donat un RLOC, té tot els EIDs que estan connectats
    var RLOCLinktedToEID = {};
    // Donat un EID, té tots els RLOCs als que està connectat
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
          serviceInstance.addRlocToRlocList(rlocs[rlocIt]);
          listEidRloc.push(rlocs[rlocIt]["locator-id"]);
          serviceInstance.addRLOCToListRLOCLinktedToEID(rlocs[rlocIt],eid_uri);
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

    serviceInstance.addRLOCToListRLOCLinktedToEID = function (rloc,eid){
      //check if rloc exists on listOfRlocs
      if (RLOCLinktedToEID[rloc["locator-id"]] === undefined)
      {
        var aux = [];
      }
      else
      {
        var aux = RLOCLinktedToEID[rloc["locator-id"]];
      }
      aux.push(eid);
      RLOCLinktedToEID[rloc["locator-id"]] = aux;
    };

    serviceInstance.getEIDRLOC = function ()
    {
      var keys = Object.keys(listOfRlocs);
      for (var i = 0; i<keys.count; i++)
      {
        alert("entro");
      }
    };

    // First function to call: gets all the lisp database content and stores it in the service
    serviceInstance.initialize = function() {
      var deferred = $q.defer();
      var auth64 = btoa('admin:admin');

      $http({
            url: 'http://odl2.cba.upc.edu:8181/restconf/config/odl-mappingservice:mapping-database/',
            method: "GET",
            withCredentials: true,
            headers: {
                'Authorization': 'Basic '+ auth64
            }
        })
      .success(function(data) {

        serviceInstance.getJSON(data);
        deferred.resolve();

      }).error(function(msg, code) {

        deferred.reject(msg);

        console.log(msg);

      });

      return deferred.promise;

    };

    // Returns all EID contained in the service
    serviceInstance.getAllEIDs = function() {
      return EidRLOC;
    };

    // Returns all RLOCs contained in the service
    serviceInstance.getAllRLOCs = function() {
      return listOfRlocs;
    };

    serviceInstance.getEidInfo = function(eidaddresss){

      var ret = {rlocs: EidRLOC[eidaddresss]};
      ret.address = eidaddresss;

      return ret;
    };

    serviceInstance.getRlocInfo = function(locatorid){

      var ret = serviceInstance.getInfoOfRLOC(locatorid);
      //ret.eids = RLOCEid[locatorid];

      return ret;
    };

    serviceInstance.getXtridInfo = function(xtrid){

      return {
                address: "1.1.1.1",
                eids: [
                  "1.1.1.1",
                  "1.1.1.2",
                  "1.1.1.3",
                  "1.1.1.4",
                  "1.1.1.5",
                  "1.1.1.6",
                  "1.1.1.7",
                  "1.1.1.8",
                  "1.1.1.9",
                  "1.1.1.0",
                  "1.1.1.",
                  "1.1.11",
                  "1.1..1",
                  "1.11.1",
                  "1..1.1",
                  "11.1.1",
                  ".1.1.1",
                  "11.1.1.1",
                  "7.7.7.7"
                ],
                rlocs: [
                  "2.2.2.2",
                  "3.3.3.3"
                ],
            };
    };

    return serviceInstance;
  }])
