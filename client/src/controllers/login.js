angular.module('beatCoin')
  .controller('LoginCtrl', function($scope, $location, $auth, toastr, $rootScope, Finance) {

    $scope.login = function() {
      $auth.login($scope.user)
        .then(function() {
          toastr.success('You have successfully signed in!');
          Finance.checkPlanned($scope.user.email)
          .then(function() {
            $location.path('/profile');
          })
        })
        .catch(function(error) {
          toastr.error(error.data.message, error.status);
        });
      };
    });
