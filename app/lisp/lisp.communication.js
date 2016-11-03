angular.module('lisp.communication', [])

  // Declaring the lisp service, which will contain all the functions we'll use to communicate with Lisp
  .factory('lispService', function() {
    var serviceInstance = {};

    serviceInstance.getEIDInfo = function(eidAddress){
    	return  {
                  "id": 0,
                  "name": "EID 0",
                  "adress": "10.0.0.0",
                  "action": "discard",
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
              };

    }

    return serviceInstance;
  })