angular.module('beatCoin')
  .controller('TransactionsCtrl', function($scope, $http, toastr, Account, Card, Finance, $rootScope, $state) {
    var transactions = [];
    var currentUser = {};
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
      // var transactions = [];
      var n = 0;
      var r = 0;
      var rc = 0;
      Card.getAllCards()
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

    $scope.printTransactions = function() {
      var columns = [
        {title: "Sender", dataKey: "senderCard"},
        {title: "Receiver", dataKey: "receiverCard"},
        {title: "Description", dataKey: "description"},
        {title: "Balance", dataKey: "transactionBalance"},
        {title: "Date", dataKey: "date"}
      ];
      var rows = transactions;
      var doc = new jsPDF('p', 'pt');
      doc.autoTable(columns, rows, {theme: 'plain', showHeader: 'everyPage', pageBreak: 'auto'});
      doc.save('Transactions_List_' + currentUser.name + '.pdf');
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

    $scope.balance = $rootScope.balance;
    $scope.getProfile();
    $scope.getTransactions();
    $scope.getChartData();

    $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }];
    $scope.options = {
      scales: {
        yAxes: [
          {
            id: 'y-axis-1',
            type: 'linear',
            display: true,
            position: 'left',
            ticks: { min: 0 }
          }
        ]
      }
    };
  });
