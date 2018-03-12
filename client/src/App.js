angular.module('beatCoin', [
  'chart.js',
  'ngMaterial',
  'ngMessages',
  'toastr',
  'ui.router',
  'satellizer',
  'credit-cards'
 ])

.config(function ($stateProvider, $urlRouterProvider, $interpolateProvider, $mdThemingProvider) {

  $mdThemingProvider.theme('docs-dark', 'default')
          .primaryPalette('grey')
          .warnPalette('red')
          .accentPalette('blue')
          .dark();

// Helper auth function
var skipIfLoggedIn = ['$q', '$auth', function($q, $auth) {
var deferred = $q.defer();
if ($auth.isAuthenticated()) {
    deferred.reject();
  } else {
    deferred.resolve();
  }
  return deferred.promise;
}];

var loginRequired = ['$q', '$location', '$auth', function($q, $location, $auth) {
var deferred = $q.defer();
if ($auth.isAuthenticated()) {
  deferred.resolve();
  } else {
    $location.path('/#!/login');
  }
  return deferred.promise;
}];

// App routes
$stateProvider
.state('home', {
  url: '/',
  controller: 'HomeCtrl',
  templateUrl: '/static/src/partials/home.html'
})

.state('login', {
  url: '/login',
  templateUrl: '/static/src/partials/login.html',
  controller: 'LoginCtrl',
  resolve: {
    skipIfLoggedIn: skipIfLoggedIn
  }
})

.state('signup', {
  url: '/signup',
  templateUrl: '/static/src/partials/signup.html',
  controller: 'SignupCtrl',
  resolve: {
    skipIfLoggedIn: skipIfLoggedIn
  }
})

.state('logout', {
  url: '/logout',
  template: null,
  controller: 'LogoutCtrl'
})

.state('profile', {
  url: '/profile',
  templateUrl: '/static/src/partials/profile.html',
  controller: 'ProfileCtrl',
  resolve: {
    loginRequired: loginRequired
  }
})

.state('bank_transfer', {
  url: '/banktransfer',
  templateUrl: '/static/src/partials/banktransfer.html',
  controller: 'BankTransferCtrl',
  resolve: {
    loginRequired: loginRequired
  }
})

.state('transactions', {
  url: '/transactions',
  templateUrl: '/static/src/partials/transactions.html',
  controller: 'TransactionsCtrl',
  resolve: {
    loginRequired: loginRequired
  }
})

.state('planned', {
  url: '/plannedpayments',
  templateUrl: '/static/src/partials/plannedpayments.html',
  controller: 'PlannedPaymentsCtrl',
  resolve: {
    loginRequired: loginRequired
  }
})

.state('administrator', {
  url: '/administrator',
  templateUrl: '/static/src/partials/administrator.html',
  controller: 'AdminCtrl'
})

.state('usersmanagement', {
  url: '/usersmanagement',
  templateUrl: '/static/src/partials/usersmanagement.html',
  controller: 'ManageCtrl'
})

$urlRouterProvider.otherwise('/');

$interpolateProvider.startSymbol('{[{');
$interpolateProvider.endSymbol('}]}');
});
