angular.module('beatCoin')
  .controller('AdminCtrl', function($scope, $auth, toastr, $location, $state, $mdDialog, $rootScope) {
    // TODO if user.enabled = false show its state of locked in red in navbar?

    $rootScope.status = '  ';
    $rootScope.admin = false;

    $rootScope.showPrompt = function(ev) {
      // Appending dialog to document.body to cover sidenav in docs app
      var confirm = $mdDialog.prompt()
      .title('Administrator')
      .textContent('Login as administrator')
      .placeholder('Password')
      .ariaLabel('arialabel')
      // .initialValue('init')
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
