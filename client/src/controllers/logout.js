angular.module('beatCoin')
  .controller('LogoutCtrl', function($location, $auth, toastr, $rootScope) {
    if (!$auth.isAuthenticated()) { return; }
    $auth.logout()
      .then(function() {
        toastr.info('You have been logged out');
        $rootScope.currentUser = "";
        $location.path('/');
      });
  });
