angular.module('beatCoin')
  .controller('ProfileCtrl', function($scope, $auth, toastr, Account, Card, Finance, $rootScope, $state, $mdDialog) {

    var currentUser = {};

    $scope.getBalance = function() {
        Finance.getBalance()
        .then(function(response) {
          $scope.balance = response.data.balance;
          $rootScope.balance = response.data.balance;
        })
        .catch(function(response) {
          toastr.error(response.data.message, response.status);
        });
    };

    $scope.showConfirm = function(ev, index) {
    var confirm = $mdDialog.confirm()
          .title('Confirm card remove')
          .textContent('Do You want to remove the selected card?')
          .ariaLabel('Lucky day')
          .targetEvent(ev)
          .ok('Confirm')
          .cancel('Cancel');

    $mdDialog.show(confirm).then(function() {
          $scope.removeCard(index);
        }, function() {
          return;
        });
    };

    $scope.card = {};

    $scope.getProfile = function() {
      Account.getProfile()
        .then(function(response) {
          $scope.user = response.data;
          $rootScope.currentUser = response.data;
          currentUser = response.data;
          if (currentUser.enabled == false) {
            toastr.error('User disabled by administrator');
          }
          $scope.getBalance();
        })
        .catch(function(response) {
          toastr.error(response.data.message, response.status);
        });
    };

    $scope.updateProfile = function() {
      Account.updateProfile($scope.user)
        .then(function() {
          toastr.success('Profile has been updated');
        })
        .catch(function(response) {
          toastr.error(response.data.message, response.status);
        });
    };

    $scope.getCards = function() {
      Card.getCards()
        .then(function(response) {
          $scope.cards = response.data;
        })
        .catch(function(response) {
          toastr.error(response.data.message, response.status);
        });
    };

    $scope.addCard = function() {
      Card.addCard($rootScope.currentUser, $scope.card)
      .then(function() {
        toastr.success('Card added successfully','Card Added');
        $state.reload();
      })
      .catch(function(response) {
        toastr.error(response.data.message, response.status);
      });
    };

    $scope.removeCard = function(index) {
      Card.removeCard($scope.cards[index])
      .then(function(response) {
        toastr.success('Card successfully removed', 'Removed');
        $state.reload();
      })
      .catch(function(response) {
        toastr.error(response.data.message, response.status);
      });
    };

    $scope.getProfile()
    $scope.getCards()
  });
