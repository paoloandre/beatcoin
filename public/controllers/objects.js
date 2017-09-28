angular.module('beatCoin')
.controller('ObjectsCtrl', function($scope, $http, $location, toastr){
  // $http.get($location.url())
  //   .success(function(docs) {
  //     $scope.objects = docs;
  //   })
  //   .error(function(err) {
  //     toastr.error('Error! Something went wrong');
  //   });
  //
  //   $scope.addObject = function(){
  //     $http.post($location.url(), $scope.newObject)
  //     .success(function(){
  //       $scope.objects.push($scope.newObject);
  //       $scope.newObject = {};
  //       toastr.success('Oggetto aggiunto con successo!');
  //     })
  //     .error(function(err){
  //       toastr.error('Error! Something went wrong');
  //     });
  //   };
  //
  //   $scope.deleteObject = function(index){
  //     $http.delete('/objects/' + $scope.objects[index]._id)
  //     .success(function(){
  //       $scope.objects.splice(index, 1);
  //       toastr.success('Oggetto eliminato con successo!');
  //     })
  //     .error(function(err){
  //       toastr.error('Error! Something went wrong');
  //     });
  //   };
  //
  //   $scope.toggleEdit = function(index){
  //     $scope.objects[index].edit = !$scope.objects[index].edit;
  //   };
  //
  //   $scope.saveObject = function(index){
  //         $http.put('/objects/' + $scope.objects[index]._id, $scope.objects[index])
  //         .success(function(){
  //           $scope.objects[index].edit = false;
  //           toastr.success('Oggetto aggiornato con successo!');
  //         })
  //         .error(function(err){
  //           toastr.error('Error! Something went wrong');
  //         });
  //       };
  //
  //   $scope.viewDetail = function(index){
  //     var path = ('/parts/' + $scope.objects[index]._id);
  //     $location.path(path);
  //   };
  });
