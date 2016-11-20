angular.module('nextService', [])

  // Declaring the next service
.factory('nextService', ['lispService', function(lispService) {
    //lispAppModule.controller('nextUIController', ['$scope', 'lispService', function($scope, lispService) {
    var serviceInstance = {};

    // instantiate NeXt app
    var app = new nx.ui.Application();
    var eids;
    var topology;
    var topoData = {};

    serviceInstance.initTopology = function(topologyContainer, nodeClickFunction) {
      var id = 0; //to accumulate the value of assigned ids
      var rlocIDs = []; //to accumulate rlocs data
      rlocIDs.name = []; //rlocs names
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
                     enterNode: '{#showNodeInfo}',
                     leaveNode: '{#removePath}',
                     topologyGenerated: '{#horizontal}',
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

                eids = lispService.getAllEIDs();
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
                  //NEW: xtrs = [];
                  var rlocs = [];

                  name = "EID " + i;
                  //NEW: ipAddress = eids[i].address;
                  ipAddress = Object.keys(eids)[i];
                  type = "EID";
                  action = "discard";
                  //NEW: xtrs = eids[i].xtr-ids;
                  rlocs = eids[Object.keys(eids)[i]];

                  // push node into nodes list
                  topoData.nodes.push(
                    {
                        'id': id,
                        'name': name,
                        'address': ipAddress,
                        'type': type,
                        'action': action,
                        //NEW: 'xtrs': xtrs
                        'rlocs': rlocs

                    })
                    id++;

                  //Add RLOC as a new Node in case it doesn't exist
                  for (var j = 0; j < rlocs.length; j++) {
                    if(rlocIDs.name.indexOf(rlocs[j]) == -1) {
                      var nameRLOC;
                      var ipAddressRLOC;
                      var typeRLOC;

                      nameRLOC = rlocs[j];
                      ipAddressRLOC = lispService.getRlocInfo(nameRLOC);
                      ipAddressRLOC = ipAddressRLOC.rloc.ipv4;
                      typeRLOC = "RLOC";

                      topoData.nodes.push(
                        {
                            'id': id,
                            'name': nameRLOC,
                            'address': ipAddressRLOC,
                            'type': typeRLOC
                        })
                      id++;
                      rlocIDs.name.push(nameRLOC);
                      rlocIDs.id.push(id-1);
                    }
                  }
/*
                  //TEST ADD xtrs
                  for (var z = 0; z < 1; z++) {
                    topoData.nodes.push(
                      {
                          'id': id,
                          'name': "XTR " + id,
                          'address': "1.1.1.1",
                          'type': "XTR"
                      })
                    id++;
                  }
*/
                }

                // convert links from original format
                var id_link = 0;

                for (var i = 0; i < id; i++) {
                  if(topoData.nodes[i].type == "EID") {
                    var rlocs2 = [];
                    rlocs2 = topoData.nodes[i].rlocs;
                    for (var j = 0; j < rlocIDs.name.length; j++) {
                        if(rlocs2.indexOf(rlocIDs.name[j]) >= 0) {
                        var sourceID;
                        var targetID;

                        sourceID = topoData.nodes[i].id;
                        targetID = rlocIDs.id[j];

                        // push link into links list
                        topoData.links.push(
                            {
                                'source': sourceID,
                                'target': targetID,
                                id: id_link
                            })
                        id_link++;
                      }
                    }
                  }
                }

                this.topologyData(topoData);
            },
            showNodeInfo: function (sender, node) {
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
                  //if its an RLOC it compares with the TARGET
                  else if(node.model()._data.type == "RLOC") {
                    return links.target == node.model()._data.id;
                  }
                });
                //for each link we draw its path
                for (var i = 0; i < links_id.length; i++) {
                    var link = [sender.getLink(links_id[i].id)];
                    var path1 = new nx.graphic.Topology.Path({
                              links: link,
                              arrow: 'cap'
                          });
                    pathLayer.addPath(path1);
                }
            },
            removePath: function (sender, events) {
              var pathLayer = sender.getLayer("paths");
              pathLayer.clear();
            },
            attach: function(args) {
                this.inherited(args);
            },
            horizontal: function(sender, node) {
              var layout = sender.getLayout('hierarchicalLayout');
              layout.direction('vertical');
              layout.sortOrder(['EID', 'XTR', 'RLOC']);
              layout.levelBy(function(node2, model) {
                return model._data.type;
              });
              sender.activateLayout('hierarchicalLayout');
            },
            registerIcon: function(sender, event) {
              var topo = this.view('topology');
              //register icon to instance
              topo.registerIcon("port", "./app/port.png",42,42);
            },
            hideAll: function() {
              var topo = this.view('topology');
              topo.eachLayer(function(layer) {
                layer.fadeOut(true);
              }, true);
            },
            showAll: function() {
              var topo = this.view('topology');
              topo.eachLayer(function(layer) {
                layer.fadeIn(true);
              }, true);
            },
            highlightEid: function(eidsInVn) {
                //highlight single node or nodes
                var topo = this.view('topology');
                var nodeLayer = topo.getLayer('nodes');
                nx.each(eidsInVn, function(eidInVn){
                  var isNode = function(node) {
                      return node.address == eidInVn;
                  };
                  var node = topoData.nodes.find(isNode);
                  topo.highlightRelatedNode(topo.getNode(node.id));
                }, true);

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
        topology.highlightEid(eidsInVn);
      }
    };

    return serviceInstance;
}]);