angular.module('productEditor')
.directive('routerLoadingIndicator', function($rootScope) {
  return {
    restrict: 'E',
    template: "<div ng-show='loading' class='loading-indicator'>" +
    "<div class='loading-indicator-body'>" +
    "<h3 class='loading-title'>Loading...</h3>" +
    "<div class='sk-folding-cube'>" +
        "<div class='sk-cube1 sk-cube'></div>" +
        "<div class='sk-cube2 sk-cube'></div>" +
        "<div class='sk-cube4 sk-cube'></div>" +
        "<div class='sk-cube3 sk-cube'></div>" +
      "</div>" +
    "</div>" +
    "</div>",
    scope: {
      loading: '='
    },
    replace: true,
    link: function(scope, elem, attrs) {
      scope.isRouteLoading = false;
    }
  };
});
