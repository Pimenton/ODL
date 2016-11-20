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
    // List with all vn-identifier
    var listOfVNI = [];
    // All Json info
    var Json =[];

    serviceInstance.getAllInfo = function(jsonObj) {
      //jsonObj has JSON response 
      var virtualNetworks = jsonObj["mapping-database"]["virtual-network-identifier"];
      Json = virtualNetworks;
      for (var i=0; i<virtualNetworks.length; i++)
      for (var j=0; i<virtualNetworks.length; j++)
      {
        var vni = virtualNetworks[i]["vni"];
        var vni = virtualNetworks[j]["vni"];
        listOfVNI.push(vni);
        var eids = virtualNetworks[i]["mapping"];
        var eids = virtualNetworks[j]["mapping"];
        for (var i = 0; i<eids.length; i++) {
        for (var i = 0; i<eids.length; i++) 
        {
          var eidInfo = eids[i]["mapping-record"]["eid"];
          var eid_uri =eids[i]["eid"];
          var mappingRecord = eids[i]["mapping-record"];
          var rlocs = mappingRecord["LocatorRecord"];
          var listEidRloc = [];
          for (var rlocIt = 0; rlocIt <rlocs.length; rlocIt++) {
          for (var rlocIt = 0; rlocIt <rlocs.length; rlocIt++) 
          {
            serviceInstance.addRlocToRlocList(rlocs[rlocIt]);
            listEidRloc.push(rlocs[rlocIt]["locator-id"]);
            serviceInstance.addRLOCToListRLOCLinktedToEID(rlocs[rlocIt],eid_uri);
          }
          EidRLOC[eids[i]["eid-uri"]] = listEidRloc;

          var typeIP = eids[i]["eid-uri"].split(":")[0];
        }
      }
    };

    serviceInstance.getJSON = function(jsonObj) {
      //jsonObj has JSON response 
      var Json = jsonObj["mapping-database"]["virtual-network-identifier"];
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
    serviceInstance.addRLOCToListRLOCLinktedToEID = function (rloc,eid)
    {
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
    serviceInstance.initialize = function() 
    {
      var deferred = $q.defer();
      var auth64 = btoa('admin:admin');

      $http({
            url: 'http://odl1.cba.upc.edu:8181/restconf/config/odl-mappingservice:mapping-database/',
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
   
    serviceInstance.getEidInfo = function(eidaddress){
    	return EidRLOC[eidaddress];
    };
    
    serviceInstance.getAllVnIds = function() {
      return VnArray;
      return listOfVNI;
    };
    
    /* Function to get EIDs in VN
    ** Retun array with eid-uri of all EIDs in VN. 
    ** Tip: Use getIPType and getIP functions to get info of eid-uri
    */
    serviceInstance.getEidsInVn = function(VnId) {
      return listOfVNI;
    serviceInstance.getEidsInVn = function(VnId) 
    {
      var eids = Json[VnId]["mapping"];
      var EIDinVN = [];
      for (var i=0;i<eids.length;i++)
      {
        EIDinVN.push(eids["eid-uri"]);
      }
      return EIDinVN;
    };
    
    serviceInstance.getAllEids = function() {
    serviceInstance.getAllEids = function() 
    {
      var obj = new Object();
      var EidList = {};
        for (var i=0; i<Json.length; i++)
      for (var i=0; i<Json.length; i++)
      {
          var vni = Json[i]["vni"];
          var eids = Json[i]["mapping"];
          for (var j = 0; j<eids.length; j++) {
            var eid_uri =eids[j]["eid"];
            var xtr = eids[j]["mapping-record"]["xtr-id"];
            obj.address = eid_uri;
            obj.xtr_id  = xtr;
            obj.vni = vni;
            EidList.push(obj);
        }
      }
      
      return EidList;
    }

    serviceInstance.getIPType = function (eidUri)
    {
      return eidUri.split(":")[0];
    };

    serviceInstance.getIP = function (eidUri)
    {
      return eidUri.substring(eidUri.split(":")[0].length+1, eidUri.length);
    };


    serviceInstance.getEidInfo = function(eidAddress) {
      return EidInfo;
    };
    
    serviceInstance.getAllxtrids = function() {
      var vni = [];
      for (var i=0;i<Json.length;i++)
      {

      }

      return XtrArray;
    };
    
     serviceInstance.getXtridInfo = function(xtridAddress) {
         //info per definir
      return Info;
    };
    
    serviceInstance.getAllRlocs = function() {
         
      return Rlocs;
    };
    serviceInstance.getRlocInfo = function (RLOC_ID)
    {
      return listOfRlocs[RLOC_ID];
    };

    return serviceInstance;
  }])
