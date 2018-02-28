angular.module('beatCoin')
  .controller('ProfileCtrl', function($scope, $auth, toastr, Account, Card, $rootScope) {

    $scope.card = {};

    $scope.getProfile = function() {
      Account.getProfile()
        .then(function(response) {
          $scope.user = response.data;
          console.log($scope.user);
          $rootScope.currentUser = response.data;
        })
        .catch(function(response) {
          toastr.error(response.data.message, response.status);
        });
    };

    $scope.updateProfile = function() {
      Account.updateProfile($scope.user)
        .then(function() {
          toastr.success('Profile has been updated');
        })
        .catch(function(response) {
          toastr.error(response.data.message, response.status);
        });
    };

    $scope.getCards = function() {
      Card.getCards()
        .then(function(response) {
          $scope.cards = response.data;
          console.log($scope.cards);
        })
        .catch(function(response) {
          toastr.error(response.data.message, response.status);
        });
    };

    $scope.addCard = function() {
      Card.addCard($rootScope.currentUser, $scope.card)
      .then(function() {
        toastr.success('Card Added');
      })
      .catch(function(response) {
        toastr.error(response.data.message, response.status);
      });
    };

    $scope.getProfile()
    $scope.getCards()

    // .then(function() {
    //
    //     .then(function(response) {
    //       console.log(response.data);
    //       // $scope.cards = response.data;
    //       // console.log($scope.cards);
    //     })
    //     .catch(function(response) {
    //       toastr.error("Error in getCards");
    //     });
    // })
    // .catch(function() {
    //   toastr.error("Error in getProfile");
    // });

  });
