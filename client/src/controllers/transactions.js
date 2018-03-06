angular.module('beatCoin')
  .controller('TransactionsCtrl', function($scope, $http, toastr, Account, Card, Finance, $rootScope, $state) {

    // var userCards = [];
    // var transactions = [];

    $scope.getChartData = function() {
      Finance.getChartData()
      .then(function(response) {
        $scope.labels = response.data.dateHistory;
        $scope.data = response.data.balanceHistory;
      })
      .catch(function(response) {
        toastr.error(response.data.message, response.status);
      });
    };

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
        // transactions = transactions;
        // console.log($scope.transactions);
    };

    $scope.getProfile = function() {
      Account.getProfile()
        .then(function(response) {
          $scope.user = response.data;
          $rootScope.currentUser = response.data;
          $scope.getBalance();
          // userCards[0] = response.data.creditCard;
        })
        .catch(function(response) {
          toastr.error(response.data.message, response.status);
        });
    };


    $scope.balance = $rootScope.balance;
    $scope.getProfile();
    $scope.getTransactions();
    $scope.getChartData();

    $scope.series = ['Series A', 'Series B'];
    $scope.onClick = function (points, evt) {
      console.log(points, evt);
    };
    $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
    $scope.options = {
      scales: {
        yAxes: [
          {
            id: 'y-axis-1',
            type: 'linear',
            display: true,
            position: 'left'
          },
          {
            id: 'y-axis-2',
            type: 'linear',
            display: true,
            position: 'right'
          }
        ]
      }
    };

    // console.log(userCards);
    // console.log(transactions);
  });
