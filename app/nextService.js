angular.module('nextService', [])

  // Declaring the next service
.factory('nextService', ['lispService', function(lispService) {
    //lispAppModule.controller('nextUIController', ['$scope', 'lispService', function($scope, lispService) {
    var serviceInstance = {};

    // instantiate NeXt app
    var app = new nx.ui.Application();
    var eids;
    var rlocs_info;
    var topology;
    var topoData = {};
    var allNodes = {
      "EID": {},
      "XTR": {},
      "RLOC": {}
    }

    serviceInstance.initTopology = function(topologyContainer, nodeClickFunction) {
      var id = 0; //to accumulate the value of assigned ids
      var id_link = 0; //to accumulate the value of the links
      var rlocIDs = []; //to accumulate rlocs data
      rlocIDs.ip = []; //rlocs names
      rlocIDs.id = []; //rlocs ids
      var xtrIDs = []; //to accumulate xtrs data
      xtrIDs.name = []; //xtrs names
      xtrIDs.id = []; //xtrs ids

      nx.define('MyTopology', nx.ui.Component, {
         view: {
             props: {
                 'class': "topology-via-api"
             },
             content: [
               {
                 name: 'topology',
                 type: 'nx.graphic.Topology',
                 props: {
                   //padding: 235,
                   adaptive: true,
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
              /*     tooltipManagerConfig: {
                          nodeTooltipContentClass: 'EIDTooltip'
                   },*/
                   // show node's icon, could change to false to show dot
                   showIcon: true,
                   // if you want to identify a node by its name
                   //identityKey: 'name',

                   // auto layout the topology
                   autoLayout: true,
                   //identityKey: 'id',
                   dataProcessor: 'force',
                   data: '{#topologyData}'
                 },
                 events: {
                     clickNode: '{#showNodeInfo}',
                     topologyGenerated: '{#generated}',
                     ready: '{#registerIcon}'
                 },
               },
            ]
         },
         properties: {
            topologyData: {},
            //defines the ICON depending on the node's name
            icon: {
                value: function() {
                    return function(vertex) {
                        var name = vertex.get("name");
                        //console.log(name);
                        if (name.startsWith("EID")) {
                            return 'cloud'
                        }
                        else if (name.startsWith("XTR")) {
                          return 'router'
                        }
                        else {
                            return 'port'
                        }
                    }
                }
            }
         },
         methods: {
            init: function(options) {
                this.inherited(options);
                this.loadRemoteData();
            },
            loadRemoteData: function() {

                eids = lispService.getAllEids();
                rlocs_info = lispService.getAllRlocs();
                var length = Object.keys(eids).length;

                //transform JSON data to NEXTUI format
                topoData.nodes = [];
                topoData.links = [];

                // convert nodes from original format
                for (var i = 0; i < length; i++) {
                  var name;
                  var ipAddress;
                  var type;
                  var action;
                  var xtr;
                  var vni;
                  var rlocs;

                  name = "EID " + i;
                  ipAddress = eids[i].address;
                  type = "EID";
                  action = "discard";
                  xtr = eids[i].xtr_id;
                  xtrIDs.push(xtr); //add xtr to xtrIDs list
                  vni = eids[i].vni;
                  rlocs = eids[i].rlocs;

                  // push node into nodes list
                  topoData.nodes.push(
                    {
                        'id': id,
                        'name': name,
                        'address': ipAddress,
                        'type': type,
                        'action': action,
                        'xtr': xtr,
                        'vni': vni,
                        'rlocs': rlocs

                    })
                    id++;

                  //If it's a new XTR
                  if(xtrIDs.name.indexOf("XTR " + xtr) == -1) {
                      var nameXTR;
                      var typeXTR;

                      nameXTR = "XTR " + xtr;
                      typeXTR = "XTR";

                      // push node into nodes list
                      topoData.nodes.push(
                        {
                            'id': id,
                            'name': nameXTR,
                            'type': typeXTR
                        })
                      xtrIDs.name.push(nameXTR);
                      xtrIDs.id.push(id);
                      id++;
                  }

                  //Add RLOC as a new Node in case it doesn't exist
                  for (var j = 0; j < rlocs.length; j++) {
                     if(rlocIDs.ip.indexOf(rlocs[j]) == -1) {
                       var nameRLOC;
                       var ipAddressRLOC;
                       var typeRLOC;
                       var exit_bucle = false;

                       //obtain RLOC's name
                       for (var k = 0; k < Object.keys(rlocs_info).length && !exit_bucle; k++) {
                         //when it finds the ipAddress translates it to its locatorID
                         if (rlocs[j] == rlocs_info[Object.keys(rlocs_info)[k]].address) {
                           nameRLOC = Object.keys(rlocs_info)[k];
                           exit_bucle = true;
                         }
                       }

                       ipAddressRLOC = rlocs[j];
                       typeRLOC = "RLOC";

                       topoData.nodes.push(
                         {
                             'id': id,
                             'name': nameRLOC,
                             'ipAddressRLOC': ipAddressRLOC,
                             'type': typeRLOC
                         })
                       rlocIDs.ip.push(ipAddressRLOC);
                       rlocIDs.id.push(id);
                       id++;
                     }
                   }
                }

                // convert links from original format
                for (var i = 0; i < id; i++) {
                  if(topoData.nodes[i].type == "EID") {
                    var xtr_node;
                    var rlocs2 = [];
                    var sourceID;
                    var targetID;

                    xtr_node = topoData.nodes[i].xtr;
                    xtr_node = "XTR " + xtr_node;
                    rlocs2 = topoData.nodes[i].rlocs;

                    for (var j = 0; j < xtrIDs.id.length; j++) {
                        if(xtr_node.indexOf(xtrIDs.name[j]) >= 0) {

                          sourceID = topoData.nodes[i].id;
                          targetID = xtrIDs.id[j];

                          // push link into links list
                          topoData.links.push(
                              {
                                  'source': sourceID,
                                  'target': targetID,
                                  'type': "eid-xtr",
                                  id: id_link
                              })
                          id_link++;

                          for (var k = 0; k < rlocIDs.ip.length; k++) {
                            if(rlocs2.indexOf(rlocIDs.ip[k]) >= 0) {

                             sourceID = xtrIDs.id[j];
                             targetID = rlocIDs.id[k];

                             // push link into links list
                             topoData.links.push(
                                 {
                                     'source': sourceID,
                                     'target': targetID,
                                     'type': "xtr-rloc",
                                     id: id_link
                                 })
                             id_link++;
                           }
                         }
                       }
                    }

                    for (var k = 0; k < rlocIDs.ip.length; k++) {
                      if(rlocs2.indexOf(rlocIDs.ip[k]) >= 0) {

                       sourceID = topoData.nodes[i].id;
                       targetID = rlocIDs.id[k];

                       // push link into links list
                       topoData.links.push(
                           {
                               'source': sourceID,
                               'target': targetID,
                               'type': "eid-rloc",
                               id: id_link
                           })
                       id_link++;
                     }
                   }

                  }
                }

                this.topologyData(topoData);
            },
            centerOnNode: function (node) {
                // Center node on selection
                var topo = this.view('topology');
                var nodeBound = node.getBound();
                var myBound = topo.stage().getContentBound();

                // This doesn't work when the sidebar is hidden
                //var sideNavWidth = document.getElementById("sidebar").clientWidth;
                var sideNavWidth = 320;
                myBound.left = nodeBound.left - (myBound.width - sideNavWidth)/2;
                var toolbarHeight = document.getElementById("toolbar").clientHeight;
                myBound.top = nodeBound.top - (myBound.height)/2;
                topo.zoomByBound(myBound);
            },
            centerOnNodeType: function (nodeId, type) {
                var topo = this.view('topology');
                var isNode = function(node) {
                    return (node.address == nodeId && node.type == type) || (node.name == nodeId && node.type == type);
                };
                var node = topoData.nodes.find(isNode);
                this.centerOnNode(topo.getNode(node.id));
            },
            showNodeInfo: function (sender, node) {
                var topo = this.view('topology');

                //Remove previous drawn paths
                var pathLayer = sender.getLayer("paths");
                pathLayer.clear();

                nodeClickFunction(node.model()._data);
                /*
                //SHOW NODE DETAILS ON THE SIDE BAR
                if(node.model()._data.type == "EID") {
                  $scope.showEidDetails(node.model()._data.address);
                }
                else if (node.model()._data.type == "RLOC") {
                  $scope.showRlocDetails(node.model()._data.name);
                } */

                //draw paths with all the links from node
                var pathLayer = sender.getLayer("paths");
                var links = topoData.links;
                //get links that are connected to node
                var links_id = links.filter(function(links){
                  //if its an EID it compares with the SOURCE
                  if(node.model()._data.type == "EID") {
                    return links.source == node.model()._data.id;
                  }
                  //if its an XTR it compares with the TARGET
                  else if(node.model()._data.type == "XTR") {
                    return links.target == node.model()._data.id;
                  }

                  else if(node.model()._data.type == "RLOC") {
                    return links.target == node.model()._data.id;
                  }
                });
                //for each link we draw its path
                for (var i = 0; i < links_id.length; i++) {
                    var link = [sender.getLink(links_id[i].id)];
                    //PENDING if(link.model()._data.type != "eid-rloc") {
                      var path1 = new nx.graphic.Topology.Path({
                                links: link,
                                arrow: 'cap'
                            });
                      pathLayer.addPath(path1);
                }

                // Show tooltip
                //topo._tooltipManager.openNodeTooltip(node);
            },
            attach: function(args) {
                this.inherited(args);
            },
            generated: function(sender, node) {

              //MAKES AN HORIZONTAL LAYOUT
              var layout = sender.getLayout('hierarchicalLayout');
              layout.direction('vertical');
              layout.sortOrder(['EID', 'XTR', 'RLOC']);
              layout.levelBy(function(node2, model) {
                return model._data.type;
              });
              sender.activateLayout('hierarchicalLayout');

              //HIDES the links EID-RLOC
              var links = sender.getLayer('links').links();
              //console.log(links);
              for (var i = 0; i < id_link; i++) {
                var link = links[i];
                if(link.model()._data.type == "eid-rloc") {
                  link.enable(false);
                }
                else {
                  link.width(2);
                }
                link.update();
              }

              var topo = this.view('topology');
              topo.eachNode(function(node) {
                  var isNode = function(datanode) {
                  return datanode.id == node["_data-id"];
                };
                var datanode = topoData.nodes.find(isNode);

                var id = datanode["name"];
                if (datanode["type"] == "EID") id = datanode["address"];
                allNodes[datanode["type"]][id] = {};
                allNodes[datanode["type"]][id]["datanode"] = datanode;
                allNodes[datanode["type"]][id]["toponode"] = node;
              }, true);

              topo.zoomByNodes(topo.getNodes());
            },
            registerIcon: function(sender, event) {
              var topo = this.view('topology');
              //register icon to instance
              topo.registerIcon("port", "./app/port.png",42,42);
            },
            hideAll: function() {
              var topo = this.view('topology');
              var nodesLayer = topo.getLayer('nodes');
              nodesLayer.highlightedElements().clear();

              var linksLayer = topo.getLayer('links');
              linksLayer.highlightedElements().clear();

            },
            showAll: function() {
              var topo = this.view('topology');
              var nodesLayer = topo.getLayer('nodes');
              nodesLayer.highlightedElements().addRange(topo.getNodes());

              var linksLayer = topo.getLayer('links');
              var links = [];
              linksLayer.eachLink(function(link) {
                links.push(link);
              }, true);
              linksLayer.highlightedElements().addRange(links);

              topo.zoomByNodes(topo.getNodes());
            },
            highlightEidWithZoom: function(eidaddress, vnId) {
              var topo = this.view('topology');
              var nodes = [];
              this.highlightEid(eidaddress, vnId, nodes);
              topo.zoomByNodes(nodes);
            },
            highlightEid: function(eidaddress, vnId, highlightedNodes) {
              var topo = this.view('topology');

              var dataid = allNodes["EID"][eidaddress]["toponode"]["_data-id"];
              var eidNode = topo.getNode(dataid);

              var nodeLayer = topo.getLayer('nodes');
              var linksLayer = topo.getLayer('links');
              nodeLayer.highlightedElements().add(eidNode);
              highlightedNodes.push(eidNode);

              var eidaddress = topoData["nodes"][eidNode["_data-id"]]["address"];
              var rlocsFromEid = lispService.getRLOCsFromEID(lispService.getIP(eidaddress))[vnId];

              eidNode.eachConnectedNode(function(xtrNode) {
              nodeLayer.highlightedElements().add(xtrNode);
              highlightedNodes.push(xtrNode);

                xtrNode.eachConnectedNode(function(connectedNode) {

                  var dataid = connectedNode["_data-id"];
                  var object = topoData["nodes"][dataid];
                  if (object["type"] == "RLOC" && rlocsFromEid.includes(object["name"])){
                    nodeLayer.highlightedElements().add(connectedNode);
                    highlightedNodes.push(connectedNode);
                  }

                }, true);

              }, true);
            },
            highlightEids: function(eidsInVn, vnId) {

              //highlight single node or nodes
              var topo = this.view('topology');
              var nodeLayer = topo.getLayer('nodes');
              var highlightedNodes = [];
              var holder = this;
              nx.each(eidsInVn, function(eidInVn){
                var nodes = [];
                holder.highlightEid(eidInVn, vnId, nodes);
                highlightedNodes.push(nodes);
              }, true);
              topo.zoomByNodes(highlightedNodes);

                // IF WE WANT THE GROUP LAYER TO SHOW UP
                /*var groupsLayer = topo.getLayer('groups');
                var group = groupsLayer.addGroup({
                    nodes: nodes,
                    shapeType: 'polygon',
                    label: 'Polygon'
                    // color: '#f00'
                });*/
            }
          }
      });

      //attach topology to document
      topology = new MyTopology();

      // app must run inside a specific container. In our case this is the one with id="topology-container"
      app.container(topologyContainer);
      topology.attach(app);

    };

    // If vnId == "all", show all the eids in the lisp protocol. Otherwise, show only the specified virtual network
    serviceInstance.selectVirtualNetwork = function(vnId) {
      if (vnId == "all") topology.showAll();
      else {
        topology.hideAll();
        var eidsInVn = lispService.getEidsInVn(vnId);
        //topology.showEids(eidsInVn);
        topology.highlightEids(eidsInVn, vnId);
      }
    };

    serviceInstance.centerOnNode = function(nodeId, nodeType) {
      topology.centerOnNodeType(nodeId, nodeType);
    };

    serviceInstance.highlightEid = function(eidaddress, vnId) {
      topology.hideAll();
      topology.highlightEidWithZoom(eidaddress, vnId);
    }

    return serviceInstance;
}]);
