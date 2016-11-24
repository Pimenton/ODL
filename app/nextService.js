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

                eids = lispService.getAllEids();
                console.log(eids);
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

                  name = "EID " + i;
                  ipAddress = eids[i].address;
                  type = "EID";
                  action = "discard";
                  xtr = eids[i].xtr_id;
                  xtrIDs.push(xtr); //add xtr to xtrIDs list
                  vni = eids[i].vni;

                  // push node into nodes list
                  topoData.nodes.push(
                    {
                        'id': id,
                        'name': name,
                        'address': ipAddress,
                        'type': type,
                        'action': action,
                        'xtr': xtr,
                        'vni': vni

                    })
                    id++;
                  //If it's a new XTR
                  if(xtrIDs.name.indexOf("XTR " + xtr) == -1) {
                      var nameXTR;
                      var ipAddressXTR;
                      var typeXTR;
                      //var rlocs = [];

                      nameXTR = "XTR " + xtr;
                      ipAddressXTR = "X.X.X.X";
                      typeXTR = "XTR";
                      //rlocs =

                      // push node into nodes list
                      topoData.nodes.push(
                        {
                            'id': id,
                            'name': nameXTR,
                            'address': ipAddressXTR,
                            'type': typeXTR
                        })
                      xtrIDs.name.push(nameXTR);
                      xtrIDs.id.push(id);
                      id++;
                  }
                }

                // convert links from original format
                var id_link = 0;

                for (var i = 0; i < id; i++) {
                  if(topoData.nodes[i].type == "EID") {
                    var xtr_node;
                    var sourceID;
                    var targetID;

                    xtr_node = topoData.nodes[i].xtr;
                    xtr_node = "XTR " + xtr_node;

                    for (var j = 0; j < xtrIDs.id.length; j++) {
                        if(xtr_node.indexOf(xtrIDs.name[j]) >= 0) {
                          var sourceID;
                          var targetID;

                          sourceID = topoData.nodes[i].id;
                          targetID = xtrIDs.id[j];

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
                // Center node on selection
                /*var topo = this.view('topology');
                var nodeBound = node.getBound();
                var myBound = topo.stage().getContentBound();
                var sideNavWidth = document.getElementById("sidebar").clientWidth;
                myBound.left = nodeBound.left - (myBound.width - sideNavWidth)/2;
                topo.zoomByBound(myBound);*/

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
                layer.hide();
              }, true);
            },
            showAll: function() {
              var topo = this.view('topology');
              topo.eachLayer(function(layer) {
                layer.show();
              }, true);
            },
            highlightEids: function(eidsInVn) {
                //highlight single node or nodes
                var topo = this.view('topology');
                var nodeLayer = topo.getLayer('nodes');
                var nodes = [];
                nx.each(eidsInVn, function(eidInVn){
                  var isNode = function(node) {
                      return node.address == eidInVn;
                  };
                  var node = topoData.nodes.find(isNode);
                  topo.highlightRelatedNode(topo.getNode(node.id));
                  nodes.push(node);
                }, true);

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
        console.log(eidsInVn);
        topology.highlightEids(eidsInVn);
      }
    };

    return serviceInstance;
}]);
