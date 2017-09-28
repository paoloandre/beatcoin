angular.module('beatCoin', [
 'ngResource',
 'ngMessages',
 'ngAnimate',
 'toastr',
 'ui.router',
 'satellizer',
 'angular-spinkit'
])

.config(function ($stateProvider, $urlRouterProvider, $authProvider, $interpolateProvider) {

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
    $location.path('/login');
  }
  return deferred.promise;
}];

// App routes
$stateProvider
.state('home', {
  url: '/',
  controller: 'HomeCtrl',
  templateUrl: '/static/partials/home.html'
})

.state('login', {
  url: '/login',
  templateUrl: '/static/partials/login.html',
  controller: 'LoginCtrl',
  resolve: {
    skipIfLoggedIn: skipIfLoggedIn
  }
})

.state('signup', {
  url: '/signup',
  templateUrl: '/static/partials/signup.html',
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
  templateUrl: '/static/partials/profile.html',
  controller: 'ProfileCtrl',
  resolve: {
    loginRequired: loginRequired
  }
})

.state('getcards', {
  url: '/cards',
  templateUrl: '/static/partials/cards.html',
  controller: 'CardsCtrl',
  resolve: {
    loginRequired: loginRequired
  }
})

// .state('getobjects', {
//   url: '/objects/:listid',
//   templateUrl: '/static/partials/objects.html',
//   controller: 'ObjectsCtrl',
//   resolve: {
//     loginRequired: loginRequired
//   }
// })
//
// .state('getparts', {
//   url: '/parts/:objectid',
//   templateUrl: '/static/partials/parts.html',
//   controller: 'PartsCtrl',
//   resolve: {
//     loginRequired: loginRequired
//   }
// })
//
// .state('getoptions', {
//   url: '/options/:partid',
//   templateUrl: '/static/partials/options.html',
//   controller: 'OptionsCtrl',
//   resolve: {
//     loginRequired: loginRequired
//   }
// })
//
// .state('goupload', {
//     url: '/goupload',
//     templateUrl: '/static/partials/upload.html',
//     controller: 'uploader',
//     resolve: {
//       loginRequired: loginRequired
//     }
// })
//
// .state('shape', {
//     url:'/shape',
//     templateUrl: '/static/partials/shapes.html',
//     controller: 'GetShapes',
//     resolve:{
//       loginRequired: loginRequired
//     }
// })

$urlRouterProvider.otherwise('/');

// Satellizer config
$authProvider.facebook({
  clientId: '1838486779739552'
});

$authProvider.google({
  clientId: '22271471199-bf7ncvn6j52228gnrkvo7pr19al7s23u.apps.googleusercontent.com'
});

$interpolateProvider.startSymbol('{[{');
$interpolateProvider.endSymbol('}]}');
});
