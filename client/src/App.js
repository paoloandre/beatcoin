angular.module('beatCoin', [
  'chart.js',
  'ngMaterial',
  'ngMessages',
  'toastr',
  'ui.router',
  'satellizer'
 ])

.config(function ($stateProvider, $urlRouterProvider, $interpolateProvider) {
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

// var adminRequired = ['$q', '$location', '$auth', function($q, $location, $auth, Account) {
// var deferred = $q.defer();
// if ($auth.isAuthenticated()) {
//   deferred.resolve();
//   } else {
//     $location.path('/administrator');
//   }
//   return deferred.promise;
// }];

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
  url: '/bank_transfer',
  templateUrl: '/static/src/partials/bank_transfer.html',
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

.state('administrator', {
  url: '/administrator',
  templateUrl: '/static/src/partials/administrator.html',
  controller: 'AdminCtrl'
  // resolve: {
  //   adminRequired: adminRequired,
  // }
})

.state('usersmanagement', {
  url: '/usersmanagement',
  templateUrl: '/static/src/partials/usersmanagement.html',
  controller: 'ManageCtrl'
  // resolve: {
  //   adminRequired: adminRequired,
  // }
})

$urlRouterProvider.otherwise('/');

$interpolateProvider.startSymbol('{[{');
$interpolateProvider.endSymbol('}]}');
});
