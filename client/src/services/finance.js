angular.module('beatCoin')
  .factory('Finance', function($http) {

    function cc_format(value) {
      var v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
      var matches = v.match(/\d{4,16}/g);
      var match = matches && matches[0] || ''
      var parts = []
      for (i=0, len=match.length; i<len; i+=4) {
        parts.push(match.substring(i, i+4))
      }
      if (parts.length) {
        return parts.join(' ')
      } else {
        return value
      }
    };

    return {
      getBalance: function() {
        return $http.get('/api/balance')
      },
      bankTransfer: function(card, amount, receiver, description, balance) {
        card.panCode = cc_format(card.panCode);
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
      },
      checkPlanned: function(email) {
        return $http.get('/api/checkplanned/' + email);
      }
    };
  });
