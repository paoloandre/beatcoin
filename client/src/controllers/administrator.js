angular.module('beatCoin')
  .controller('AdminCtrl', function($scope, $auth, toastr, $location, $state, $mdDialog, $rootScope) {

    $rootScope.status = '  ';
    $rootScope.admin = false;

    $rootScope.showPrompt = function(ev) {
      // Appending dialog to document.body to cover sidenav in docs app
      var confirm = $mdDialog.prompt()
      .title('Administrator')
      .textContent('Login as administrator')
      .placeholder('Password')
      .ariaLabel('arialabel')
      .targetEvent(ev)
      .required(true)
      .ok('Login')
      .cancel('Cancel');

      $mdDialog.show(confirm)
      .then(function(result) {
        if (result == "bankdirector") {
          $rootScope.admin = true;
          $location.path('/usersmanagement');
        }
      });
    };

    $rootScope.showPrompt();
  });
