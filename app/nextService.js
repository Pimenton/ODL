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
    };
    var selectedVn = "all";

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

                  ipAddress = eids[i].address;
                  name = "EID " + i;
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
                      ipAddressXTR = xtr;
                      typeXTR = "XTR";

                      // push node into nodes list
                      topoData.nodes.push(
                        {
                            'id': id,
                            'name': nameXTR,
                            'xtrid': xtr,
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
                       var weight;
                       var exit_bucle = false;

                       //obtain locatorID from ipAddress
                       for (var k = 0; k < Object.keys(rlocs_info).length && !exit_bucle; k++) {
                         //when it finds the ipAddress translates it to its locatorID
                         if (rlocs[j] == rlocs_info[Object.keys(rlocs_info)[k]].address) {
                           nameRLOC = Object.keys(rlocs_info)[k];
                           weight = lispService.getRlocInfo(nameRLOC).weight;
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
                             'weight': weight,
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

                             //we verify if the XTR-RLOC link already exists
                             var links = topoData.links;
                             var linkExists = links.filter(function(links){
                               return links.source == sourceID &&
                                links.target == targetID;
                             });
                             //if there's still no link between sourceID and targetID
                             if (linkExists.length == 0) {
                               // push link into links list

                               topoData.links.push(
                                   {
                                       'source': sourceID,
                                       'target': targetID,
                                       'type': "xtr-rloc",
                                       'weight': 1,
                                       id: id_link
                                   })
                               id_link++;
                             }
                             else {
                               topoData.links[linkExists[0].id].weight++;
                             }
                           }
                         }
                       }
                    }

                    /*for (var k = 0; k < rlocIDs.ip.length; k++) {
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
                   }*/

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
                var node = allNodes[type][nodeId];

                this.centerOnNode(topo.getNode(node["toponode"]["_data-id"]));
            },
            showNodeInfo: function (sender, node) {
                var topo = this.view('topology');

                nodeClickFunction(node.model()._data);
/*
                if (node.model()._data.type == "RLOC") {
                  var rlocName = node.model()._data.name;
                  this.highlightRlocWithZoom(rlocName, selectedVn);
                } else {

                  //Remove previous drawn paths
                  var pathLayer = sender.getLayer("paths");
                  pathLayer.clear();

                  //draw paths with all the links from node
                  var pathLayer = sender.getLayer("paths");
                  var links = topoData.links;
                  //get links that are connected to node
                  var links_id = links.filter(function(links){
                    //if its an EID it compares with the SOURCE
                    //if(node.model()._data.type == "EID") {
                    //  return (links.source == node.model()._data.id && links.type != "eid-xtr");
                    //}
                    //if its an XTR it compares with the TARGET
                    if(node.model()._data.type == "XTR") {
                      return links.target == node.model()._data.id;
                    }

                    //else if(node.model()._data.type == "RLOC") {
                    //  return (links.target == node.model()._data.id && links.type != "xtr-rloc");
                    //}
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
                }*/
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

              //DISABLES the links EID-RLOC
              var links = sender.getLayer('links').links();
              //console.log(links);
              for (var i = 0; i < id_link; i++) {
                var link = links[i];
                if(link.model()._data.type == "eid-rloc") {
                  //link.enable(false);
                  link.color("#FFFFFF");
                }
                else if(link.model()._data.type == "xtr-rloc") {
                  link.width(link.model()._data.weight*2);
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
                else if (datanode["type"] == "XTR") id = datanode["xtrid"];
                allNodes[datanode["type"]][id] = {};
                allNodes[datanode["type"]][id]["datanode"] = datanode;
                allNodes[datanode["type"]][id]["toponode"] = node;
              }, true);
            },
            registerIcon: function(sender, event) {
              var topo = this.view('topology');
              //register icon to instance
              topo.registerIcon("port", "./app/img/port.png",42,42);
            },
            disableAll: function() {
              var topo = this.view('topology');
              var nodesLayer = topo.getLayer('nodes');

              nodesLayer.eachNode(function(node) {
                node.enable(false);
              }, true);

              var linksLayer = topo.getLayer('links');
              linksLayer.eachLink(function(link) {
                link.enable(false);
                link.update();
              }, true);

            },
            hideAll: function() {
              var topo = this.view('topology');
              var nodesLayer = topo.getLayer('nodes');
              nodesLayer.highlightedElements().clear();

              var linksLayer = topo.getLayer('links');
              linksLayer.highlightedElements().clear();
              linksLayer.eachLink(function(link) {
                //link.enable(true);
                link.update();
              }, true);

              var pathLayer = topo.getLayer("paths");
              pathLayer.clear();
            },
            enableAll: function() {
              var topo = this.view('topology');

              var nodesLayer = topo.getLayer('nodes');
              nodesLayer.eachNode(function(node) {
                node.enable(true);
              }, true);

              var linksLayer = topo.getLayer('links');
              linksLayer.eachLink(function(link) {
                link.enable(true);
                link.update();
              }, true);
            },
            showAll: function(zoom) {
              var topo = this.view('topology');
              var nodesLayer = topo.getLayer('nodes');
              nodesLayer.highlightedElements().addRange(topo.getNodes());

              var linksLayer = topo.getLayer('links');
              var links = [];
              linksLayer.eachLink(function(link) {
                links.push(link);
              }, true);
              //linksLayer.highlightedElements().addRange(nx.util.values(links));
              linksLayer.highlightLinks(links);

              if (zoom) topo.zoomByNodes(topo.getNodes());

              var pathLayer = topo.getLayer("paths");
              pathLayer.clear();
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
              var pathLayer = topo.getLayer('paths');
              pathLayer.clear();

              nodeLayer.highlightedElements().add(eidNode);
              eidNode.enable(true);
              highlightedNodes.push(eidNode);

              var eidaddress = topoData["nodes"][eidNode["_data-id"]]["address"];
              var rlocsFromEid;
              var allRlocs = lispService.getRLOCsFromEID(lispService.getIP(eidaddress));
              if (vnId == "all") {
                angular.forEach(allRlocs, function(value, key) {
                  rlocsFromEid = rlocsFromEid.concat(allRlocs);
                });
              } else {
                rlocsFromEid = allRlocs[vnId];
              }

              eidNode.eachLink(function(link) {
                var xtrNode = link.targetNode();

                nodeLayer.highlightedElements().add(xtrNode);
                xtrNode.enable(true);
                highlightedNodes.push(xtrNode);
                
                var path = new nx.graphic.Topology.Path({
                                links: [link],
                                arrow: 'cap'
                            });
                pathLayer.addPath(path);

                xtrNode.eachLink(function(link2) {
                  var connectedNode = link2.targetNode();

                  var dataid = connectedNode["_data-id"];
                  var object = topoData["nodes"][dataid];
                  if (object["type"] == "RLOC" && rlocsFromEid.includes(object["name"])){
                    nodeLayer.highlightedElements().add(connectedNode);
                    connectedNode.enable(true);
                    highlightedNodes.push(connectedNode);
                    
                    var path1 = new nx.graphic.Topology.Path({
                                links: [link2],
                                arrow: 'cap'
                            });
                    pathLayer.addPath(path1);
                  }

                }, true);

              }, true);
            },
            highlightXtr: function(xtrid) {
              var topo = this.view('topology');
              //Remove previous drawn paths
              var nodeLayer = topo.getLayer("nodes");
              var pathLayer = topo.getLayer("paths");
              pathLayer.clear();
              var node = topo.getNode(allNodes["XTR"][xtrid]["toponode"]["_data-id"]);
              node.eachLink(function(link) {
                var path = new nx.graphic.Topology.Path({
                              links: [link],
                              arrow: 'cap'
                          });
                pathLayer.addPath(path);
              }, true);
               
              nodeLayer.highlightedElements().add(node);
              node.eachConnectedNode(function(connectedNode) {
                nodeLayer.highlightedElements().add(connectedNode);
              }, true);
/*
              //draw paths with all the links from node
              var links = topoData.links;
              //get links that are connected to node
              var links_id = links.filter(function(links){
                //if its an EID it compares with the SOURCE
                //if(node.model()._data.type == "EID") {
                //  return (links.source == node.model()._data.id && links.type != "eid-xtr");
                //}
                //if its an XTR it compares with the TARGET
                if(node.model()._data.type == "XTR") {
                  return links.target == node.model()._data.id;
                }

                //else if(node.model()._data.type == "RLOC") {
                //  return (links.target == node.model()._data.id && links.type != "xtr-rloc");
                //}
              });
              //for each link we draw its path
              for (var i = 0; i < links_id.length; i++) {
                  var link = [topo.getLink(links_id[i].id)];
                  //PENDING if(link.model()._data.type != "eid-rloc") {
                    var path1 = new nx.graphic.Topology.Path({
                              links: link,
                              arrow: 'cap'
                          });
                    pathLayer.addPath(path1);
              }*/

            },
            highlightRlocWithZoom: function(rlocName, vnId) {
              var topo = this.view('topology');
              var nodes = [];
              this.highlightRloc(rlocName, vnId, nodes);
              topo.zoomByNodes(nodes);
            },
            highlightRloc: function(rlocName, vnId, highlightedNodes) {
              var topo = this.view('topology');

              var dataid = allNodes["RLOC"][rlocName]["toponode"]["_data-id"];
              var rlocNode = topo.getNode(dataid);

              var nodeLayer = topo.getLayer('nodes');
              var linksLayer = topo.getLayer('links');
              var pathLayer = topo.getLayer('paths');
              pathLayer.clear();

              nodeLayer.highlightedElements().add(rlocNode);
              rlocNode.enable(true);
              highlightedNodes.push(rlocNode);

              var rlocInfo = lispService.getRlocInfo(rlocName);
              var eidsFromRloc = lispService.getEIDsFromRLOC(rlocInfo["address_type"], rlocInfo["address"]);

              rlocNode.eachLink(function(link) {
                var xtrNode = link.sourceNode();

                nodeLayer.highlightedElements().add(xtrNode);
                xtrNode.enable(true);
                highlightedNodes.push(xtrNode);
                
                var path = new nx.graphic.Topology.Path({
                                links: [link],
                                arrow: 'cap'
                            });
                pathLayer.addPath(path);

                xtrNode.eachLink(function(link2) {
                  var connectedNode = link2.sourceNode();

                  var dataid = connectedNode["_data-id"];
                  var object = topoData["nodes"][dataid];
                  if (object["type"] == "EID" && eidsFromRloc.includes(object["address"])){
                    nodeLayer.highlightedElements().add(connectedNode);
                    connectedNode.enable(true);
                    highlightedNodes.push(connectedNode);
                    
                    var path1 = new nx.graphic.Topology.Path({
                                links: [link2],
                                arrow: 'cap'
                            });
                    pathLayer.addPath(path1);
                  }

                }, true);

              }, true);
            },
            highlightEids: function(eidsInVn, vnId) {

              //highlight single node or nodes
              var topo = this.view('topology');
              var nodeLayer = topo.getLayer('nodes');
              var pathLayer = topo.getLayer('paths');

              var highlightedNodes = [""];
              var holder = this;
              nx.each(eidsInVn, function(eidInVn){
                var nodes = [];
                holder.highlightEid(eidInVn, vnId, nodes);
                highlightedNodes = highlightedNodes.concat(nodes);
              }, true);
              topo.zoomByNodes(highlightedNodes);

              pathLayer.clear();

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
    serviceInstance.selectVirtualNetwork = function(vnId, zoom) {
      selectedVn = vnId;
      if (vnId == "all") {
        topology.enableAll();
        topology.showAll(zoom);
      } else {
        topology.hideAll();
        topology.disableAll();
        var eidsInVn = lispService.getEidsInVn(vnId);
        //topology.showEids(eidsInVn);
        topology.highlightEids(eidsInVn, vnId);
      }
    };

    serviceInstance.selectNode = function(nodeId, nodeType) {
      if (nodeType == "XTR"){
        topology.centerOnNodeType(nodeId, nodeType);
        topology.highlightXtr(nodeId);
      } else if (nodeType == "RLOC") {
        topology.highlightRlocWithZoom(nodeId, selectedVn);
      }
    };

    serviceInstance.highlightEid = function(eidaddress, vnId) {
      topology.hideAll();
      topology.highlightEidWithZoom(eidaddress, vnId);
    }

    return serviceInstance;
}]);
