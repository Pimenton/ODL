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
 
 
$.getJSON('exampl.json', function (jsonObj) { 
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
        addRlocToRlocList(rlocs[rlocIt]); 
        listEidRloc.push(rlocs[rlocIt]["locator-id"]); 
        addRLOCToListRLOCLinktedToEID(rlocs[rlocIt],eid_uri); 
      } 
      EidRLOC[eids[i]["eid-uri"]] = listEidRloc; 
 
      var typeIP = eids[i]["eid-uri"].split(":")[0]; 
    } 
  } 
}); 
 
function addRlocToRlocList(rloc){ 
  //check if rloc exists on listOfRlocs 
  listOfRlocs[rloc["locator-id"]] = rloc; 
} 
 
function getRLOCsFromEID(eidUri) 
{ 
  return EidRLOC[eidUri]; 
} 
 
function getInfoOfRLOC(RLOC_ID) 
{ 
  return listOfRlocs[RLOC_ID]; 
} 
 
function getIPType() 
{ 
  return eidUri.split(":")[0]; 
} 
 
function getAddressType(eidUri) 
{ 
  return "ietf-lisp-address-types:" + getIPType(eidUri) + "-afi"; 
} 
 
function getIP(eidUri) 
{ 
  return eidUri.substring(eidUri.split(":")[0].length+1, eidUri.length); 
} 
 
