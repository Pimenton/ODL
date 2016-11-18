(function(nx){

    // Tying angular components together
    var lispAppModule = angular.module('lispOverlayApp', ['ngMaterial', 'app.directives', 'app.controllers', 'lisp.communication', 'nextService']);

    lispAppModule.config(function($httpProvider, $mdThemingProvider) {

      //Enable cross domain calls
      $httpProvider.defaults.useXDomain = true;

      // Define app theme
      $mdThemingProvider.theme('default')
        .primaryPalette('indigo')
        .accentPalette('light-green');
    });




})(nx);
