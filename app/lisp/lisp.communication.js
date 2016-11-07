angular.module('lisp.communication', [])

  // Declaring the lisp service, which will contain all the functions we'll use to communicate with Lisp
  .factory('lispService', function() {
    var serviceInstance = {};

    serviceInstance.getAllEids = function() {
		
    	return [
    	{
                  "address": "10.0.0.0",
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
        },
    	{
                  "address": "10.0.0.1",
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
        },
    	{
                  "address": "10.0.0.2",
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
        },
    	];
    };

    serviceInstance.getEidInfo = function(eidaddresss){
    	return  {
                  "id": 0,
                  "name": "EID 0",
                  "address": "10.0.0.0",
                  "action": "discard",
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

    }

    return serviceInstance;
  })