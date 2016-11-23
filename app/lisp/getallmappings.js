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

function getMappingEID(eidUri)
{
	var addresType = getAddressType(eidUri);
	var idType = getIPType(eidUri);
	var ip = getIP(eidUri);
}

function addRlocToRLOCEid(rloc,eid){
	//check if rloc exists on listOfRlocs
    RLOCEid[rloc["locator-id"]].push(eid);
}
function getEIDRLOC()
{
	var keys = Object.keys(listOfRlocs);
	for (var i = 0; i<keys.count; i++) 
	{
		alert("entro");
	}
}

function getEidsInVn(VnId) 
{
	var eids = Json[VnId]["mapping"];
	var EIDinVN = [];
	for (var i=0;i<eids.length;i++)
	{
		EIDinVN.push(eids[i]["eid-uri"]);
	}
	return EIDinVN;
}

function getAllEids() 
{
	var obj = new Object();
	var EidList = []];
	for (var i=0; i<Json.length; i++)
	{
		var vni = Json[i]["vni"];
		var eids = Json[i]["mapping"];
		for (var j = 0; j<eids.length; j++) {
			var eid_uri = eids[j]["eid-uri"];
			var xtr = eids[j]["mapping-record"]["xtr-id"];
			obj.address = eid_uri;
			obj.xtr_id  = xtr;
			obj.vni = vni;
			EidList.push(obj);
		}
	}
	return EidList;
}

function addRLOCToListRLOCLinktedToEID(rloc,eid)
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
}

function getAllVnIds() 
{
	return listOfVNI;
}