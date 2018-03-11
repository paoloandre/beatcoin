angular.module('beatCoin')
  .controller('PlannedPaymentsCtrl', function($scope, $auth, toastr, Account, Card, Finance, $rootScope, $state, $mdDialog) {

    var currentUser = {};

    $scope.showConfirm = function(ev, index) {
    var confirm = $mdDialog.confirm()
          .title('Confirm planned payment remove')
          .textContent('Do You want to remove the selected payment?')
          .ariaLabel('Lucky day')
          .targetEvent(ev)
          .ok('Confirm')
          .cancel('Cancel');

    $mdDialog.show(confirm).then(function() {
          $scope.removePlanned(index);
        }, function() {
          return;
        });
    };

    $scope.pp = {};

    $scope.getProfile = function() {
      Account.getProfile()
        .then(function(response) {
          $scope.user = response.data;
          $rootScope.currentUser = response.data;
          currentUser = response.data;
        })
        .catch(function(response) {
          toastr.error(response.data.message, response.status);
        });
    };

    $scope.getPp = function() {
      Finance.getPp()
        .then(function(response) {
          $scope.pps = response.data;
        })
        .catch(function(response) {
          toastr.error(response.data.message, response.status);
        });
    };

    $scope.addPp = function() {
      Finance.addPp($rootScope.currentUser, $scope.pp)
      .then(function() {
        toastr.success('Planned Payment added successfully','Payment Added');
        $state.reload();
      })
      .catch(function(response) {
        toastr.error(response.data.message, response.status);
      });
    };

    $scope.removePlanned = function(index) {
      Finance.removePp($scope.pps[index])
      .then(function(response) {
        toastr.success('Planned Payment successfully removed', 'Removed');
        $state.reload();
      })
      .catch(function(response) {
        toastr.error(response.data.message, response.status);
      });
    };

    $scope.getProfile()
    $scope.getPp()
  });
