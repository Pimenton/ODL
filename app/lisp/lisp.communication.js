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
    var Json = [];

    serviceInstance.getAllInfo = function(jsonObj) {
      //jsonObj has JSON response
      var virtualNetworks = jsonObj["mapping-database"]["virtual-network-identifier"];
      Json = virtualNetworks;
      for (var j=0; j<virtualNetworks.length; j++)
      {
        var vni = virtualNetworks[j]["vni"];
        listOfVNI.push(vni);
        var eids = virtualNetworks[j]["mapping"];
        for (var i = 0; i<eids.length; i++)
        {
          var eidInfo = eids[i]["mapping-record"]["eid"];
          var eid_uri =eids[i]["eid"];
          var mappingRecord = eids[i]["mapping-record"];
          var rlocs = mappingRecord["LocatorRecord"];
          var listEidRloc = [];
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

    serviceInstance.addRlocToRlocList = function(rloc){
      //check if rloc exists on listOfRlocs
      listOfRlocs[rloc["locator-id"]] = rloc;
    };

    serviceInstance.getRLOCsFromEID = function (eidaddress)
    {
      var EidInfo = {};
      for (var i=0; i<Json.length; i++)
      {
          var vni = Json[i]["vni"];
          var eids = Json[i]["mapping"];
          for (var j = 0; j<eids.length; j++)
          {
            var eid_uri = eids[j]["eid-uri"];
            var obj = [];
            if(eidaddress == serviceInstance.getIP(eid_uri)){
              var rlocs = eids[j]["mapping-record"]["LocatorRecord"]
              for (var rlocIt = 0; rlocIt <rlocs.length; rlocIt++)
              {
                var typeIP = rlocs[rlocIt]["rloc"]["address-type"].split(":")[1].split("-")[0];
                obj.push(rlocs[rlocIt]["locator-id"]);
              }
              EidInfo[vni] = obj;
            }

        }
      }
      return EidInfo;
    };

    serviceInstance.getAddressType = function (eidUri)
    {
      return "ietf-lisp-address-types:" + serviceInstance.getIPType(eidUri) + "-afi";
    };

    serviceInstance.getMappingEID = function (eidUri)
    {
      var addresType = serviceInstance.getAddressType(eidUri);
      var idType = serviceInstance.getIPType(eidUri);
      var ip = serviceInstance.getIP(eidUri);
    };

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

    serviceInstance.getEIDsFromRLOC = function(addressType, addressIP)
    {

      var eids = [];
      for (var i=0; i<Json.length; i++)
      {
        var mappingOfVNI = Json[i]["mapping"];
        for (var j=0; j<mappingOfVNI.length;j++)
        {
          var locatorRecords = mappingOfVNI[j]["mapping-record"]["LocatorRecord"];
          for (var z=0; z<locatorRecords.length;z++)
          {
            if (serviceInstance.getIPTypeOfRLOC(locatorRecords[z]["rloc"]["address-type"]) == addressType)
            {
              if (locatorRecords[z]["rloc"][addressType] == addressIP)
              {
                eids.push(mappingOfVNI[j]["eid-uri"])
              }
            }
          }
        }
      }
      return eids;
    };

    // First function to call: gets all the lisp database content and stores it in the service
    serviceInstance.initialize = function()
    {
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

        serviceInstance.getAllInfo(data);
        deferred.resolve();

      }).error(function(msg, code) {

        deferred.reject(msg);
        console.log(msg);

      });

      return deferred.promise;

    };

    // Returns all EID contained in the service

    serviceInstance.getEidInfo = function(eidaddress){
      var EidInfo = {};
      for (var i=0; i<Json.length; i++)
      {
          var vni = Json[i]["vni"];
          var eids = Json[i]["mapping"];
          for (var j = 0; j<eids.length; j++)
          {
            var eid_uri = eids[j]["eid-uri"];
            var obj = new Object();
            if(eidaddress == serviceInstance.getIP(eid_uri)){
              obj.xtr_id = eids[j]["mapping-record"]["xtr-id"];
              obj.address = serviceInstance.getIP(eid_uri);
              obj.address_type = serviceInstance.getIPType(eid_uri);
              obj.recordTtl = eids[j]["mapping-record"]["recordTtl"];
              obj.authoritative = eids[j]["mapping-record"]["authoritative"];
              obj.action = eids[j]["mapping-record"]["action"];
              EidInfo[vni] = obj;
            }

        }
      }
      return EidInfo;
    };

    serviceInstance.getAllVnIds = function() {
      return listOfVNI;
    };

    /* Function to get EIDs in VN
    ** Retun array with eid-uri of all EIDs in VN.
    ** Tip: Use getIPType and getIP functions to get info of eid-uri
    */
    serviceInstance.getEidsInVn = function(VnId)
    {
      var EIDinVN = [];
      for (var i=0; i<Json.length; i++)
      {
        if (Json[i]["vni"] == VnId)
        {
          var eids = Json[i]["mapping"];
          for (var j=0;j<eids.length;j++)
          {
            EIDinVN.push(eids[j]["eid-uri"]);
          }
        }
      }
      return EIDinVN;
    };

    serviceInstance.getAllEids = function()
    {
      var EidList = [];
      for (var i=0; i<Json.length; i++)
      {
          var eids = Json[i]["mapping"];
          var vni = Json[i]["vni"]
          var vectorEIds = [];
          for (var j = 0; j<eids.length; j++)
          {
            var obj = new Object();
            var eid_uri = eids[j]["eid-uri"];
            var xtr = eids[j]["mapping-record"]["xtr-id"];
            obj.vni = vni;
            obj.address = eid_uri;
            obj.xtr_id  = xtr;
            var rlocs = eids[j]["mapping-record"]["LocatorRecord"];
            var RLocAdr = [];
            for (var rlocIt = 0; rlocIt <rlocs.length; rlocIt++)
            {
              var typeIP = rlocs[rlocIt]["rloc"]["address-type"].split(":")[1].split("-")[0];
              RLocAdr.push(rlocs[rlocIt]["rloc"][typeIP]);
            }
            obj.rlocs = RLocAdr;
            EidList.push(obj);
          }
        }
      return EidList;
    };

    serviceInstance.getIPType = function (eidUri)
    {
      return eidUri.split(":")[0];
    };

    serviceInstance.getIP = function (eidUri)
    {
      return eidUri.substring(eidUri.split(":")[0].length+1, eidUri.length);
    };

    serviceInstance.getRLOCs = function (vni, eid)
    {
      var rlocs = Json[vni]["mapping"][eid]["mapping-record"]["LocatorRecord"]
      var rloc_iterator;
      var rlocsOfEID = [];
      for (rloc_iterator = 0; rloc_iterator < rlocs.length; ++rloc_iterator)
      {
        rlocsOfEID.push(rlocs[rloc_iterator]);
      }
      return rlocsOfEID;
    };

    serviceInstance.getAllxtrids = function() {
       var vectorXTR = {};
      for (var i=0; i<Json.length; i++)
      {
        var eids = Json[i]["mapping"];
        for (var j=0; j<eids.length; j++)
        {
          var obj = {};
          var xtrInfo_id = eids[j]["mapping-record"]["xtr-id"];
          if(typeof vectorXTR[xtrInfo_id] != "undefined") obj = vectorXTR[xtrInfo_id];
          var rlocs = serviceInstance.getRLOCs(i,j);
          for(var k=0;k<rlocs.length;k++){
            var address = rlocs[k]["rloc"][rlocs[k]["rloc"]["address-type"].split(":")[1].split("-")[0]];
            obj[rlocs[k]["locator-id"]]= address;
          }
          vectorXTR[xtrInfo_id] = obj;
        }
      }
      return vectorXTR;
    };

    serviceInstance.getAllRlocs = function() {
      var ListRlocs = {};
      var RlocId;
      var RlocIp;
      for (var i=0; i<Json.length; i++)
      {
          var eids = Json[i]["mapping"];
          for (var j = 0; j<eids.length; j++)
          {
            var rlocs = eids[j]["mapping-record"]["LocatorRecord"];
            for (var rlocIt = 0; rlocIt <rlocs.length; rlocIt++) {
              RlocId = rlocs[rlocIt]["locator-id"];
              RlocIp = rlocs[rlocIt]["rloc"][rlocs[rlocIt]["rloc"]["address-type"].split(":")[1].split("-")[0]];
              var obj = new Object;
              obj.address= RlocIp;
              ListRlocs[RlocId]= obj;

          }
        }
      }

      return ListRlocs;
    };

    serviceInstance.getRlocInfo = function (RLOC_ID)
    {
     var obj = new Object();
      for (var i=0; i<Json.length; i++)
      {
          var eids = Json[i]["mapping"];
          for (var j = 0; j<eids.length; j++)
          {
            var rlocs = eids[j]["mapping-record"]["LocatorRecord"];
            for (var rlocIt = 0; rlocIt <rlocs.length; rlocIt++) {
              if(RLOC_ID == rlocs[rlocIt]["locator-id"]){
                obj.id = rlocs[rlocIt]["locator-id"];
                obj.address_type = rlocs[rlocIt]["rloc"]["address-type"].split(":")[1].split("-")[0];
                obj.address = rlocs[rlocIt]["rloc"][obj.address_type];
                obj.weight = rlocs[rlocIt]["weight"];
                obj.routed = rlocs[rlocIt]["routed"];
                obj.rlocProbed = rlocs[rlocIt]["rlocProbed"];
                obj.localLocator = rlocs[rlocIt]["localLocator"];
                obj.priority = rlocs[rlocIt]["priority"];
                obj.multicastweight = rlocs[rlocIt]["multicastWeight"];
                obj.xtr_id = eids[j]["mapping-record"]["xtr-id"];
            }
          }
        }
      }
      return obj;
    };

    serviceInstance.getIPTypeOfRLOC = function(rlocAddressType)
    {
      return rlocAddressType.split(":")[1].split("-")[0];
    };

    serviceInstance.getXTRInfo = function(action, xtrId)
    {
      var xtrInfo = [];
      for (var i=0; i<Json.length; i++)
      {
        var obj = new Object();

        obj.vni = Json[i]["vni"];
        obj.info = []
        var eids = Json[i]["mapping"];
        switch(action)
        {
          case "EID":
            for (var j = 0; j<eids.length; j++)
            {
              var xtr = eids[j]["mapping-record"]["xtr-id"];
              if (xtr == xtrId)
              {
                var EID_RLOCS = new Object();
                EID_RLOCS.eid = eids[j]["eid-uri"];
                EID_RLOCS.rlocs = serviceInstance.getRLOCs(i, j);
                var rlocs = eids[j]["mapping-record"]["LocatorRecord"];
                obj.info.push(EID_RLOCS);
                /*for (var rlocIt=0; rlocIt<rlocs.length; rlocIt++)
                {
                  EID_RLOCS.rlocs.push(rlocs[rlocIt]["rloc"][getIPTypeOfRLOC(rlocs[rlocIt]["rloc"]["address-type"])])
                  /*var rlocIP = rlocs[rlocIt]["rloc"][getIPType(rlocs[rlocIt]["rloc"]["address-type"])];
                  obj.info.push(rlocIP);*/
               /* }
                obj.info.push(EID_RLOCS);*/
              }
            }
            break;
          case "RLOC":
            var dictionaryRLOC = {}
            var rlocsList = [];
            for (var j = 0; j<eids.length; j++)
            {
              var xtr = eids[j]["mapping-record"]["xtr-id"];
              if (xtr == xtrId)
              {

                var rlocs = eids[j]["mapping-record"]["LocatorRecord"];
                for (var rlocIt=0; rlocIt<rlocs.length; rlocIt++)
                {
                  var rlocIP = String(rlocs[rlocIt]["rloc"][serviceInstance.getIPTypeOfRLOC(rlocs[rlocIt]["rloc"]["address-type"])]);
                  if (rlocsList.indexOf(rlocIP) == -1) rlocsList.push(rlocIP);
                  if (dictionaryRLOC[rlocIP] == undefined) dictionaryRLOC[rlocIP] = []
                  dictionaryRLOC[rlocIP].push(eids[j]["eid-uri"]);
                  }
              }
            }

            for (var rloc_itList = 0; rloc_itList < rlocsList.length; rloc_itList++)
            {
              var RLOC_EID = new Object();
              RLOC_EID.rloc = rlocsList[rloc_itList]
              RLOC_EID.info = dictionaryRLOC[rlocsList[rloc_itList]];
              obj.info.push(RLOC_EID)
            }
            break;
        }
        xtrInfo[i] = obj;
      }
      return xtrInfo;
    };

    return serviceInstance;
  }])
