angular.module('productEditor')
.controller('GetShapes', function($scope, $http, $location){
$http.get('/shape').success(function( docs ) {
  $scope.shapes = docs;
});
});
