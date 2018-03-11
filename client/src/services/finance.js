angular.module('beatCoin')
  .factory('Finance', function($http) {
    return {
      getBalance: function() {
        return $http.get('/api/balance')
      },
      bankTransfer: function(card, amount, receiver, description, balance) {
        return $http.get('/api/banktransfer/' + card.panCode + '/' + amount + '/' + receiver + '/' + description + '/' + balance);
      },
      getTransactions: function(card) {
        return $http.get('/api/transactions/' + card);
      },
      getChartData: function() {
        return $http.get('/api/chartdata');
      },
      addPp: function(user, pp) {
        var pp = {
          "user": user._id,
          "description": pp.description,
          "amount": pp.amount,
          "date": pp.date
        };
        return $http.put('/api/addpp/', pp);
      },
      getPp: function() {
        return $http.get('/api/pps');
      },
      removePp: function(pp) {
        return $http.delete('/api/pp/' + pp._id)
      }
    };
  });
