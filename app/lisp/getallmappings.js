var listOfRlocs = {};
var RLOCEid = {};
var EidRLOC = {};

$.getJSON('exampl.json', function (jsonObj) {
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

