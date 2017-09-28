angular.module('beatCoin')
  .controller('NavbarCtrl', function($scope, $auth, toastr, Account) {

    $scope.isAuthenticated = function() {
      return $auth.isAuthenticated();
    };

    $scope.getProfile = function() {
      Account.getProfile()
        .then(function(response) {
          $scope.user = response.data;
          console.log(response.data);
        })
        .catch(function(response) {
          toastr.error(response.data.message, response.status);
          console.log(response.data.message);
        });
    };

    $scope.getProfile();
  });
