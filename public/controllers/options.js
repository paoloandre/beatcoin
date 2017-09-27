angular.module('productEditor')
.controller('OptionsCtrl', function($scope, $http, $location, toastr){
  $http.get($location.url())
    .success(function(docs) {
      $scope.options = docs;
    })
    .error(function(err) {
      toastr.error('Error! Something went wrong');
    });

    $scope.addOption = function(){
      $http.post($location.url(), $scope.newOption)
      .success(function(){
        $scope.options.push($scope.newOption);
        $scope.newOption = {};
        toastr.success('Parte aggiunta con successo!');
      })
      .error(function(err){
        toastr.error('Error! Something went wrong');
      });
    };

    $scope.deleteOption = function(index){
      $http.delete('/options/' + $scope.options[index]._id)
      .success(function(){
        $scope.options.splice(index, 1);
        toastr.success('Parte eliminata con successo!');
      })
      .error(function(err){
        toastr.error('Error! Something went wrong');
      });
    };

    $scope.toggleEdit = function(index){
      $scope.options[index].edit = !$scope.options[index].edit;
    };

    $scope.saveOption = function(index){
          $http.put('/options/' + $scope.options[index]._id, $scope.options[index])
          .success(function(){
            $scope.options[index].edit = false;
            toastr.success('Parte aggiornata con successo!');
          })
          .error(function(err){
            toastr.error('Error! Something went wrong');
          });
        };
  });
