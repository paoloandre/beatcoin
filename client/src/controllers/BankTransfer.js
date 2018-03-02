angular.module('beatCoin')
  .controller('BankTransferCtrl', function($scope, $http, toastr, Card, Account, $rootScope, $state) {
    
    $scope.showConfirm = function(ev) {
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.confirm()
          .title('Would you like to delete your debt?')
          .textContent('All of the banks have agreed to forgive you your debts.')
          .ariaLabel('Lucky day')
          .targetEvent(ev)
          .ok('Please do it!')
          .cancel('Sounds like a scam');

    $mdDialog.show(confirm).then(function() {
      $scope.status = 'You decided to get rid of your debt.';
    }, function() {
      $scope.status = 'You decided to keep your debt.';
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
      Card.bankTransfer($scope.cards[index], $scope.amount, $scope.receiver, $scope.description)
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
