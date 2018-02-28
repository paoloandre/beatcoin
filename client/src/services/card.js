angular.module('beatCoin')
  .factory('Card', function($http) {
    return {
      getCards: function(user) {
        // return $http.get('/api/cards');
        // console.log("getting api/cards");
      },
      addCard: function(user, card) {
        // console.log(user._id);
        // console.log(card);
        var card = {
          "user": user._id,
          "panCode": card.panCode,
          "circuit": card.circuit,
          "expDate": card.expDate,
          "securityNumb": card.securityNumb,
          "balance": card.balance
        };
        // console.log(card);
        return $http.put('/api/cards', card);
      }
    };
  });
