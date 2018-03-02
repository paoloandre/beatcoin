angular.module('beatCoin')
  .controller('ProfileCtrl', function($scope, $auth, toastr, Account, Card, $rootScope, $state) {

    $scope.getBalance = function() {
        var balance = 0;
        for (var i = 0; i < $scope.cards.length; i++) {
            var cardbal = $scope.cards[i].balance;
            balance += cardbal;
        }
        $scope.balance = balance;
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

    $scope.getProfile()
    $scope.getCards()
  });
