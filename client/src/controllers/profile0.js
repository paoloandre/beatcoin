angular.module('beatCoin')
  .controller('ProfileCtrl', function($scope, $auth, toastr, Account, Card, $rootScope, $state, $mdDialog) {

    $scope.getBalance = function() {
        var balance = 0;
        for (var i = 0; i < $scope.cards.length; i++) {
            var cardbal = $scope.cards[i].balance;
            balance += cardbal;
        }
        $scope.balance = balance;
        $rootScope.balance = balance;
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
          $scope.getBalance();
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
