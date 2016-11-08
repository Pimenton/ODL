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

      var eids = lispService.getAllEIDs();

      // instantiate NeXt app
      var app = new nx.ui.Application();
              eid = {
                  "id": 0,
                  "name": "EID 0",
                  "address": "10.0.0.0",
                  "action": "discard",
                  "rlocs2": [1,1,1,1,1],
                  "rlocs": [
                    {
                      "address": "11.11.11.11"
                    },
                    {
                      "address": "11.11.11.11"
                    },
                    {
                      "address": "11.11.11.11"
                    },
                    {
                      "address": "11.11.11.11"
                    },
                    {
                      "address": "11.11.11.11"
                    },
                    {
                      "address": "11.11.11.11"
                    },
                    {
                      "address": "11.11.11.12"
                    },
                    {
                      "address": "11.11.11.13"
                    },
                    {
                      "address": "11.11.11.14"
                    }
                  ]
              };

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
                  "address": "10.0.0.0",
                  "action": "discard",
                  "rlocs2": [1,1,1,1,1],
              		"rlocs": [
              			{
              				"address": "11.11.11.11"
              			},
              			{
              				"address": "11.11.11.11"
              			},
              			{
              				"address": "11.11.11.11"
              			},
              			{
              				"address": "11.11.11.11"
              			},
              			{
              				"address": "11.11.11.11"
              			},
              			{
              				"address": "11.11.11.11"
              			},
              			{
              				"address": "11.11.11.12"
              			},
              			{
              				"address": "11.11.11.13"
              			},
              			{
              				"address": "11.11.11.14"
              			}
              		]
              }
          },
         view: {
             content: [
               {
                 type: 'nx.graphic.Topology',
                 props: {
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
                   tooltipManagerConfig: {
                          nodeTooltipContentClass: 'EIDTooltip'
                   },
                   // show node's icon, could change to false to show dot
                   showIcon: true,
                   // if you want to identify a node by its name
                   //identityKey: 'name',

                   // auto layout the topology
                   autoLayout: true,
                   dataProcessor: 'force',
                   data: topoData
                 },
                 events: {
                     clickNode: '{#showEidInfo}'
                 },
               },
            ]
         },
         methods: {
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
