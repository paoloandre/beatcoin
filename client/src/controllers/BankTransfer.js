angular.module('beatCoin')
  .controller('BankTransferCtrl', function($scope, $http, toastr, Card, Account, Finance, $rootScope, $state, $mdDialog) {

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
          .title('Confirm transfer')
          .textContent('Do You want to confirm the bank transfer with the selected card?')
          .ariaLabel('Lucky day')
          .targetEvent(ev)
          .ok('Confirm')
          .cancel('Cancel');

    $mdDialog.show(confirm).then(function() {
          $scope.bankTransfer(index);
        }, function() {
          return;
        });
    };

    $scope.bankTransfer = function(index) {
      if ($scope.amount == 0 | $scope.amount == null) {
        toastr.error("Check the amount","Error");
        return;
      }
      else if ($scope.amount > $scope.cards[index].balance) {
        toastr.error("Insufficient funds on this card", "Error");
        return;
      }
      Finance.bankTransfer($scope.cards[index], $scope.amount, $scope.receiver, $scope.description, $rootScope.balance)
      .then(function(response) {
        toastr.success('Transfer correctly done', 'Bank Transfer');
        $state.reload();
      })
      .catch(function(response) {
        toastr.error(response.data.message, response.status);
      });
    };

    $scope.getProfile = function() {
      Account.getProfile()
        .then(function(response) {
          $scope.user = response.data;
          $rootScope.currentUser = response.data;
          currentUser = response.data;
          $scope.getBalance();
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

    $scope.getProfile();
    $scope.getCards();
  });
