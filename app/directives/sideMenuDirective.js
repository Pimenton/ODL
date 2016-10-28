angular.module('app.directive.sideMenuDirective', [])
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

