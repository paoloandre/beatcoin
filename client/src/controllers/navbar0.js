angular.module('beatCoin')
  .controller('NavbarCtrl', function($scope, $auth, Account) {
    $scope.isAuthenticated = function() {
      return $auth.isAuthenticated();
    };
  });
