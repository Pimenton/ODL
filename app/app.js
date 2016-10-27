(function(nx){

    // Tying angular components together
    var myAppModule = angular.module('lispOverlayApp', ['ui.bootstrap', 'app.directives', 'app.controllers']);

    // instantiate NeXt app
    var app = new nx.ui.Application();
/*
  //  $.getJSON("http://127.0.0.1:8181/restconf/operational/network-topology:network-topology/",function(data) {topologyData = data});

  // Get data from OpenDaylight
    var data;
    $.ajax({
      type: "GET",
      url: "http://localhost:8181/restconf/operational/network-topology:network-topology",
      dataType: "json",
      beforeSend: function(xhr) {
              xhr.setRequestHeader("Authorization", "Basic " + btoa("admin:admin"));
          },
          success: function (topologyData) {
              data = topologyData;
              }
    });


    // create empty topology data json object
    var topoData = {};

    // add nodes object array
    topoData.nodes = [];
    var nodeInfoTableData = [];

    // convert nodes from original format
    for (i = 0; i < data.topology[0].node.length; i++) {
        var name;
        var ipAddress;
        var l;
        l = 1;
        var prefix = "";
        if (data.topology[0].node[i]['l3-unicast-igp-topology:igp-node-attributes'].name != undefined) {
            name = data.topology[0].node[i]['l3-unicast-igp-topology:igp-node-attributes'].name;
        }
        else if (data.topology[0].node[i]['l3-unicast-igp-topology:igp-node-attributes']['router-id'] != undefined) {
            name = data.topology[0].node[i]['l3-unicast-igp-topology:igp-node-attributes']['router-id'][0];

        }
        else {
            name = "UnKnown " + l;
            l++;
        }

        if (data.topology[0].node[i]['l3-unicast-igp-topology:igp-node-attributes']['router-id'] != undefined) {
            ipAddress = data.topology[0].node[i]['l3-unicast-igp-topology:igp-node-attributes']['router-id'][0];
        }
        else {
            ipAddress = "UnKnown";
        }
        if (data.topology[0].node[i]['l3-unicast-igp-topology:igp-node-attributes'].prefix != undefined) {
            for (x = 0; x < data.topology[0].node[style="float:right;"i]['l3-unicast-igp-topology:igp-node-attributes'].prefix.length; x++) {
                prefix = prefix + data.topology[0].node[i]['l3-unicast-igp-topology:igp-node-attributes'].prefix[x].prefix + ", ";
            }
        }
        else {
            prefix = "N/A";
        }

        // push node into nodes list
        topoData.nodes.push(
            {

                'name': name,
                'node-id': data.topology[0].node[i]['node-id'],
                'ipaddress': ipAddress,
                'prefix': prefix
            })
        var nodeInfo = {
            'name': name,
            'node-id': data.topology[0].node[i]['node-id'],
            'ipaddress': ipAddress,
            'prefix': prefix
        }

        nodeInfoTableData.add(nodeInfo);

    }

    // add links object array
    topoData.links = [];

    // convert links from original format
    for (i = 0; i < data.topology[0].link.length; i++) {
        var sourceNodeID = data.topology[0].link[i].source['source-node'];
        var destinationNodeID = data.topology[0].link[i].destination['dest-node'];
        var metric = data.topology[0].link[i]['l3-unicast-igp-topology:igp-link-attributes'].metric

        for (x = 0; x < topoData.nodes.length; x++) {
            if (sourceNodeID == topoData.nodes[x]['node-id']) {
                var source = topoData.nodes[x].name;
                for (y = 0; y < topoData.nodes.length; y++) {
                    if (destinationNodeID == topoData.nodes[y]['node-id']) {
                        var target = topoData.nodes[y].name;
                        var linksArrayLength = topoData.links.length

                        if (linksArrayLength > 0) {
                            var count = 0;
                            var index;
                            for (z = 0; z < topoData.links.length; z++) {

                                if (source == topoData.links[z].target && target == topoData.links[z].source) {
                                    count++;
                                    index = z;

                                }

                            }
                            if (count == 0) {

                                // push link into links array
                                topoData.links.push(
                                    {
                                        'source': source,
                                        'target': target,
                                        'metric': metric
                                    })
                            }
                            else {
                                existingMetric = topoData.links[index].metric;
                                metric = existingMetric + "/" + metric;
                                topoData.links[index].metric = metric;
                            }
                        }
                        else {
                            topoData.links.push(
                                {
                                    'source': source,
                                    'target': target,
                                    'metric': metric
                                })
                        }
                    }

                }
            }

        }
    }
*/
    // initialize a topology
    var topo = new nx.graphic.Topology({
        // set the topology view's with and height
        width: 650,
        height: 700,
        // node config
        nodeConfig: {
            // label display name from of node's model, could change to 'model.name' to show name
            label: 'model.name'
        },
        // link config
        linkConfig: {
            // multiple link type is curve, could change to 'parallel' to use parallel link
            linkType: 'curve'
        },
        // show node's icon, could change to false to show dot
        showIcon: true,
        // identified with name
        identityKey: 'name',

        // auto layout the topology
        autoLayout: false,
        dataProcessor: 'force'
    });

    //set converted data to topology
    topo.data(topoData);
    //attach topology to document
    topo.attach(app);

    // app must run inside a specific container. In our case this is the one with id="topology-container"
    app.container(document.getElementById("topology-container"));

})(nx);
