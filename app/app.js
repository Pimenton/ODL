(function(nx){

    // Tying angular components together
    var myAppModule = angular.module('lispOverlayApp', ['ngMaterial', 'app.directives', 'app.controllers']);

    // Define app theme
    myAppModule.config(function($mdThemingProvider) {
      $mdThemingProvider.theme('default')
        .primaryPalette('indigo')
        .accentPalette('light-green');
    });

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
          success: function (topologyData) {{
            "id": 0,
            "name": "EID 0",
            "adress": "10.0.0.0",
            "action": "discard",
            "rlocs2": [1,1,1,1,1],
        		"rlocs": [
        			{
        				"adress": "11.11.11.11"
        			},
        			{
        				"adress": "11.11.11.11"
        			},
        			{
        				"adress": "11.11.11.11"
        			},
        			{
        				"adress": "11.11.11.11"
        			},
        			{
        				"adress": "11.11.11.11"
        			},
        			{
        				"adress": "11.11.11.11"
        			},
        			{
        				"adress": "11.11.11.12"
        			},
        			{
        				"adress": "11.11.11.13"
        			},
        			{
        				"adress": "11.11.11.14"
        			}
        		]
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
    nx.define('MyTopology', nx.ui.Component, {
        properties: {
            //defines the ICON depending on the node's name
            icon: {
                value: function() {
                    return function(vertex) {
                        var name = vertex.get("name");
                        //console.log(name);
                        if (name.startsWith("EID")) {
                            return 'cloud'
                        } else {
                            return 'unknown'
                        }
                    }
                }
            },
            eid: {
                "id": 0,
                "name": "EID 0",
                "adress": "10.0.0.0",
                "action": "discard",
                "rlocs2": [1,1,1,1,1],
            		"rlocs": [
            			{
            				"adress": "11.11.11.11"
            			},
            			{
            				"adress": "11.11.11.11"
            			},
            			{
            				"adress": "11.11.11.11"
            			},
            			{
            				"adress": "11.11.11.11"
            			},
            			{
            				"adress": "11.11.11.11"
            			},
            			{
            				"adress": "11.11.11.11"
            			},
            			{
            				"adress": "11.11.11.12"
            			},
            			{
            				"adress": "11.11.11.13"
            			},
            			{
            				"adress": "11.11.11.14"
            			}
            		]
            }
        },
       view: {
           content: [
             {
               type: 'nx.graphic.Topology',
               props: {
                 width: 1000,
                 height: 720,
                 adaptative: true,
                 // node config
                 nodeConfig: {
                     // label display name from of node's model, could change to 'model.name' to show name
                     label: 'model.name',
                     iconType: '{#icon}'
                 },
                 // link config
                 linkConfig: {
                     // multiple link type is curve, could change to 'parallel' to use parallel link
                     linkType: 'curve'
                 },
                 tooltipManagerConfig: {
                        nodeTooltipContentClass: 'EIDTooltip'
                 },
                 // show node's icon, could change to false to show dot
                 showIcon: true,
                 // if you want to identify a node by its name
                 //identityKey: 'name',

                 // auto layout the topology
                 autoLayout: false,
                 dataProcessor: 'force',
                 data: topoData
               },
               events: {
                   selectNode: '{#showEidInfo}'
               },
             },
            {
                tag: 'p',
                content: [
                    {
                        tag: 'span',
                        content: 'Selected: '
                    },
                    {
                        tag: 'span',
                        content: '{#eid}'
                    }
                ]
            }
          ]
       },
       methods: {
          showEidInfo: function (sender, node) {
              this.eid(node.label());
              //$scope.openSideMenu();
              //showEidDetails(eid);
          },
          attach: function(args) {
              this.inherited(args);
          }
       }
    });

    //attach topology to document
    var comp = new MyTopology();
    // app must run inside a specific container. In our case this is the one with id="topology-container"
    app.container(document.getElementById("topology-container"));

    comp.attach(app);

})(nx);
