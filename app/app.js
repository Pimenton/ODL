(function(nx){

    // Tying angular components together
    var lispAppModule = angular.module('lispOverlayApp', ['ngMaterial', 'app.directives', 'app.controllers', 'lisp.communication']);

    lispAppModule.config(function($httpProvider, $mdThemingProvider) {

      //Enable cross domain calls
      $httpProvider.defaults.useXDomain = true;

      // Define app theme
      $mdThemingProvider.theme('default')
        .primaryPalette('indigo')
        .accentPalette('light-green');
    });


    lispAppModule.controller('nextUIController', ['$scope', 'lispService', function($scope, lispService) {

    //  var eids = lispService.getAllEIDs();
    //  console.log(eids);

      // instantiate NeXt app
      var app = new nx.ui.Application();

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
                   adaptive: true,
                   // node config
                   nodeConfig: {
                       // label display name from of node's model, could change to 'model.name' to show name
                       label: 'model.name',
                       iconType: 'cloud'
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
                   autoLayout: true,
                   //identityKey: 'id',
                   dataProcessor: 'force',
                   data: '{#topologyData}'
                 },
                 events: {
                     selectNode: '{#showEidInfo}'
                 },
               },
            ]
         },
         properties: {
            topologyData: {}
         },
         methods: {
            init: function(options) {
                this.inherited(options);
                this.loadRemoteData();
            },
            loadRemoteData: function() {
                var eids = lispService.getAllEIDs();
                var length = Object.keys(eids).length;
                console.log(eids);
                console.log(length);

                //transform JSON data to NEXTUI format
                topoData.nodes = [];
                topoData.links = [];

                // convert nodes from original format
                for (var i = 0; i < length; i++) {
                  var name;
                  var ipAddress;
                  var action;

                  name = "EID " + i;
                  ipAddress = Object.keys(eids)[i];
                  action = "discard";

                  // push node into nodes list
                topoData.nodes.push(
                    {
                        'id': i,
                        'name': name,
                        'address': ipAddress,
                        'action': action

                    })
                }
                //add Central node
                topoData.nodes.push(
                    {
                        'id': length,
                        'name': "cloud",
                        'address': "-",
                        'action': "-"

                    })

                // convert links from original format
                for (var i = 0; i < length; i++) {
                    var sourceID;
                    var targetID;

                    sourceID = i;
                    targetID = length;

                    // push link into links list
                    topoData.links.push(
                        {
                            'source': sourceID,
                            'target': targetID
                        })
                }

                this.topologyData(topoData);
            },
            showEidInfo: function (sender, node) {
                //this.eid(node.model(address));
                //$scope.openSideMenu();
                $scope.showEidDetails(node.model()._data.address);
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
    }]);


})(nx);
