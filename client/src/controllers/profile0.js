angular.module('beatCoin')
  .controller('ProfileCtrl', function($scope, $auth, toastr, Account, Card, $rootScope) {

    $scope.card = {};

    $scope.getProfile = function() {
      Account.getProfile()
        .then(function(response) {
          $scope.user = response.data;
          $rootScope.currentUser = response.data;
          $scope.getCards()
            .then(function(response) {

            })
            .catch(function(response) {
              toastr.error(response.data.message, response.status);
            });
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
      console.log($rootScope.currentUser);
      Card.getCards()
        .then(function(response) {
          console.log(response.data);
          // $scope.card = response.data;
          // $rootScope.currentUser = response.data;
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

    $scope.getProfile();
  });
