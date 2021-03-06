angular.module('beatCoin')
  .controller('ManageCtrl', function($scope, $auth, toastr, Account, $state, $rootScope, $location) {
    var admin = $rootScope.admin;

    $scope.isAdmin = function() {
      if (admin == undefined || admin == false) {
        $location.path('/administrator');
      }
      else if (admin == true) {
        return true;
      };
    };

    $scope.getUsers = function() {
      Account.getUsers()
        .then(function(response) {
          $scope.users = response.data;
        })
        .catch(function(response) {
          toastr.error(response.data.message, response.status);
        });
    };

    $scope.disableUser = function(index) {
      Account.disableUser($scope.users[index])
      .then(function(response) {
        toastr.success('Account Holder Status Changed', 'Success');
        $state.reload();
      })
      .catch(function(response) {
        toastr.error(response.data.message, response.status);
      });
    };

    $scope.isAdmin();
    $scope.getUsers();
});
