angular.module('beatCoin')
  .controller('TransactionsCtrl', function($scope, $http, toastr, Card, Finance, $rootScope, $state) {


    $scope.getTransactions = function() {
      var cards = [];
      var i = 0;
      var transactions = [];
      var n = 0;
      var r = 0;
      var rc = 0;
      Card.getCards()
        .then(function(response) {
          for (i = 0; i < response.data.length; i++) {
            cards[i] = response.data[i].panCode;
          };
          for (n = 0; n < cards.length; n++) {
            Finance.getTransactions(cards[n])
            .then(function(response) {
              if (response.data != "") {
              var rc = 0;
              for (rc = 0; rc < response.data.length; rc++) {
                  transactions[r] = response.data[rc];
                  r++;
                };
              };
            })
            .catch(function(response) {
              toastr.error(response.data.message, response.status);
            });
          };
        })
        .catch(function(response) {
          toastr.error(response.data.message, response.status);
        });
        $scope.transactions = transactions;
    };

    $scope.balance = $rootScope.balance;
    $scope.getTransactions();
  });
