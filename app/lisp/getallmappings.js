var listOfRlocs = {};
var EidRLOC = {};

$.getJSON('exampl.json', function (jsonObj) {
	//jsonObj has JSON response 
	var eids = jsonObj["mapping-database"]["virtual-network-identifier"][0]["mapping"];
	for (var i = 0; i<eids.length; i++) {
		var eidInfo = eids[i]["eid"];
		var mappingRecord = eids[i]["mapping-record"];
		var rlocs = mappingRecord["LocatorRecord"];
		var listEidRloc = [];
		for (var rlocIt = 0; rlocIt <rlocs.length; rlocIt++) {
			addRlocToRlocList(rlocs[rlocIt]);
			listEidRloc.push(rlocs[rlocIt]["locator-id"]);
		}
		EidRLOC[eids[i]["eid-uri"]] = listEidRloc;

		var typeIP = eids[i]["eid-uri"].split(":")[0];
	}
});

function addRlocToRlocList(rloc){
	//check if rloc exists on listOfRlocs
	listOfRlocs[rloc["locator-id"]] = rloc;
}

function getEIDRLOC()
{
	var keys = Object.keys(listOfRlocs);
	for (var i = 0; i<keys.count; i++) 
	{
		alert("entro");
	}
}