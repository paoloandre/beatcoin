angular.module('beatCoin')
.controller('DialogCtrl', function($scope, $auth, toastr, $location, $state, $mdDialog) {
  $scope.submit = function(){
    console.log($scope.username);
    console.log($scope.password);
  }
});
