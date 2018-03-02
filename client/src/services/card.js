angular.module('beatCoin')
  .factory('Card', function($http) {
    return {
      getCards: function() {
        return $http.get('/api/cards');
      },
      addCard: function(user, card) {
        var card = {
          "user": user._id,
          "panCode": card.panCode,
          "circuit": card.circuit,
          "expDate": card.expDate,
          "securityNumb": card.securityNumb,
          "balance": card.balance
        };
        return $http.put('/api/cards', card);
      },
      bankTransfer: function(card, amount, receiver, description) {
        return $http.get('/api/banktransfer/' + card.panCode + '/' + amount + '/' + receiver + '/' + description);
      }
    };
  });
