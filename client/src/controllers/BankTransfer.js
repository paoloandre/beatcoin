angular.module('beatCoin')
  .controller('BankTransferCtrl', function($scope, $http, toastr, Card, Account, $rootScope) {

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

    $scope.getCards = function() {
      var i = 0;
      Card.getCards()
        .then(function(response) {
          $scope.cards = response.data;
          // $scope.cards.selected = false;
          for (i=0; i < $scope.cards.length; i++) {
              $scope.cards[i].selected = false;
          }
          console.log($scope.cards);
        })
        .catch(function(response) {
          toastr.error(response.data.message, response.status);
        });
    };

    $scope.getProfile();
    $scope.getCards();

  });
