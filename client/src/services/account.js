angular.module('beatCoin')
  .factory('Account', function($http) {
    return {
      getProfile: function() {
        return $http.get('/api/me');
        console.log("getting api/me");
      },
      updateProfile: function(profileData) {
        return $http.put('/api/me', profileData);
      }
    };
  });
