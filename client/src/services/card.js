angular.module('beatCoin')
  .factory('Card', function($http) {

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
      getCards: function() {
        return $http.get('/api/cards');
      },
      getAllCards: function() {
        return $http.get('/api/allcards');
      },
      addCard: function(user, card) {
        card.panCode = cc_format(card.panCode);
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
      removeCard: function(card) {
        return $http.delete('/api/cards/' + card._id + '/' + card.panCode + '/' + card.balance);
      }
    };
  });
