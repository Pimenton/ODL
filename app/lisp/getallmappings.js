var listOfRlocs;
$.getJSON('exampl.json', function (jsonStr) {
	var eids = jsonStr["mapping-database"]["virtual-network-identifier"][0]["mapping"];
	for (var i = 0; i<Object.keys(eids).length - 1; i++) {
		var eidInfo = eids[i]["eid"];
		var mappingRecord = eids[i]["mapping-record"];
		var rlocs = mappingRecord["LocatorRecord"];

		for (var i = rlocsrlocsrlocs.length - 1; i >= 0; i--) {
			rlocs[i]
		}
		var typeIP = eids[i]["eid-uri"].split(":")[0]

	}
	//var count = obj.count;
	//items.push("<ul>");
	//$.each(obj, function( key, val ) {
	//	items.push("<li id='" + key + "'>" + val + "</li>");
	//});
	//items.push("</ul>");
	//$("#ajaxphp-result").html = items.join("");
});