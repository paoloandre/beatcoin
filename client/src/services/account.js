angular.module('beatCoin')
  .factory('Account', function($http) {
    return {
      getProfile: function() {
        return $http.get('/api/me');
      },
      updateProfile: function(profileData) {
        return $http.put('/api/me', profileData);
      },
      getUsers: function() {
        return $http.get('/api/accountholders');
      },
      disableUser: function(user) {
        return $http.get('/api/disableuser/' + user._id);
      }
    };
  });
