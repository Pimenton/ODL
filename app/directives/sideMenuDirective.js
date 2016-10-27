angular.module('app.directive.sideMenuDirective', [])
 .controller('sideNavigationController', ['$scope', function($scope) {
 	$scope.templateUrl = "app/templates/eidDetails.html";

 	$scope.showEidDetails = function($eid) {
 		openNav();
 		$scope.eid = $eid;
	 	$scope.state = "eid";
 	};
 	$scope.showRlocDetails = function($rloc) {
 		$scope.rloc = $rloc;
 	 	$scope.state = "rloc";
 	};

	eid = {
		adress: "180.188.99.1",
		action: "discard",
		rlocs: [
			{
				adress: "11.11.11.11"
			},
			{
				adress: "11.11.11.12"
			},
			{
				adress: "11.11.11.13"
			},
			{
				adress: "11.11.11.14"
			}
		]
	};
	$scope.showEidDetails(eid);

 }])
 .directive('sideMenu', function() {
  	return {
		// link: function (scope, element, attrs) {
  //           scope.$watch('activity', function (activity) {
  //           	var templateUrl = getTemplateUrl(activity.type);
  //           	scope.templateUrl = templateUrl;
  //           });
  //       },
        //template: '<div ng-switch on="state">	<div ng-switch-when="eid">"eid"</div><div ng-switch-when="rloc"></div>	<div ng-switch-default>		default	</div>		</div>',
        templateUrl: 'app/templates/detailMenu.html'
   	};
});

