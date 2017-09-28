angular.module('beatCoin')
.controller('PartsCtrl', function($scope, $http, $location, toastr){
  // $http.get($location.url())
  //   .success(function(docs) {
  //     $scope.parts = docs;
  //   })
  //   .error(function(err) {
  //     toastr.error('Error! Something went wrong');
  //   });
  //
  //   $scope.addPart = function(){
  //     $http.post($location.url(), $scope.newPart)
  //     .success(function(){
  //       $scope.parts.push($scope.newPart);
  //       $scope.newPart = {};
  //       toastr.success('Parte aggiunta con successo!');
  //     })
  //     .error(function(err){
  //       toastr.error('Error! Something went wrong');
  //     });
  //   };
  //
  //   $scope.deletePart = function(index){
  //     $http.delete('/parts/' + $scope.parts[index]._id)
  //     .success(function(){
  //       $scope.parts.splice(index, 1);
  //       toastr.success('Parte eliminata con successo!');
  //     })
  //     .error(function(err){
  //       toastr.error('Error! Something went wrong');
  //     });
  //   };
  //
  //   $scope.toggleEdit = function(index){
  //     $scope.parts[index].edit = !$scope.parts[index].edit;
  //   };
  //
  //   $scope.savePart = function(index){
  //         $http.put('/parts/' + $scope.parts[index]._id, $scope.parts[index])
  //         .success(function(){
  //           $scope.parts[index].edit = false;
  //           toastr.success('Parte aggiornata con successo!');
  //         })
  //         .error(function(err){
  //           toastr.error('Error! Something went wrong');
  //         });
  //       };
  //
  //   $scope.viewDetail = function(index){
  //     var path = ('/options/' + $scope.parts[index]._id);
  //     $location.path(path);
  //   };
  });
