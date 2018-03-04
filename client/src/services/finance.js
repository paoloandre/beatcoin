angular.module('beatCoin')
  .factory('Finance', function($http) {
    return {
      bankTransfer: function(card, amount, receiver, description) {
        return $http.get('/api/banktransfer/' + card.panCode + '/' + amount + '/' + receiver + '/' + description);
      },
      getTransactions: function(card) {
        return $http.get('/api/transactions/' + card);
      }
    };
  });
