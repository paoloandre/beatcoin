angular.module('beatCoin')
  .controller('LoginCtrl', function($scope, $location, $auth, toastr, $rootScope) {

    $scope.login = function() {
      $auth.login($scope.user)
        .then(function() {
          toastr.success('You have successfully signed in!');
          $location.path('/profile');
        })
        .catch(function(error) {
          toastr.error(error.data.message, error.status);
        });
    };
  });
