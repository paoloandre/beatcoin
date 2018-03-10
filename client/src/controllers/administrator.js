angular.module('beatCoin')
  .controller('AdminCtrl', function($scope, $auth, toastr, $location, $state, $mdDialog, $rootScope) {
    // TODO GET show users with almost all informations
    // every user has a LOCK ACCOUNT button which locks its Account
    // TODO create a field on user schema "enabled" which state means if the user
    // can or cannot do operations
    // TODO make a check in add/remove card, bank transfer => if user.enabled = false
    // block the started operation.
    // TODO if user.enabled = false show its state of locked in red in navbar?

    $rootScope.status = '  ';

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
        console.log(result);
        if (result == "bankdirector") {
          console.log("logged in");
          $location.path('/usersmanagement');
          // $state.reload();
        }
        // $state.reload();
      })
      .catch(function() {
        $state.reload();
      });
    };

    $rootScope.showPrompt();

  });
