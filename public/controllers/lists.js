angular.module('productEditor')
.controller('ListsCtrl', function($scope, $http, $location, toastr){
  $http.get('/lists')
    .success(function(docs) {
      $scope.lists = docs;
    })
    .error(function(err) {
      toastr.error('Error! Something went wrong');
    });

    $scope.addList = function(){
      $http.post('/lists', $scope.newList)
      .success(function(){
        $scope.lists.push($scope.newList);
        $scope.newList = {};
        toastr.success('Lista aggiunta con successo!');
      })
      .error(function(err){
        toastr.error('Error! Something went wrong');
      });
    };

    $scope.deleteList = function(index){
      $http.delete('/lists/' + $scope.lists[index]._id)
      .success(function(){
        $scope.lists.splice(index, 1);
        toastr.success('Lista eliminata con successo!');
      })
      .error(function(err){
        toastr.error('Error! Something went wrong');
      });
    };

    $scope.toggleEdit = function(index){
      $scope.lists[index].edit = !$scope.lists[index].edit;
    };

    $scope.saveList = function(index){
          $http.put('/lists/' + $scope.lists[index]._id, $scope.lists[index])
          .success(function(){
            $scope.lists[index].edit = false;
            toastr.success('Lista aggiornata con successo!');
          })
          .error(function(err){
            toastr.error('Error! Something went wrong');
          });
        };

    $scope.viewDetail = function(index){
      var path = ('/objects/' + $scope.lists[index]._id);
      $location.path(path);
    };
  });
// $scope.$on('$stateChangeSuccess', function () {
//   $http.get('/lists').success(function( docs ) {
//     $scope.lists = docs;
//   });
// });
// $scope.geturl = function(id){
//   var path = '/lists/' + id;
//   // console.log(path);
//   $location.path(path);
// };
// $scope.toggleEdit = function(index){
//       $scope.games[index].edit = !$scope.games[index].edit;
//     };
// $scope.editList = function(id){
//
// }
// })
//
// .controller('AddListCtrl', function($scope, $http, $location, toastr){
//   $scope.addlist = function(){
//   $http({method: 'POST',
//       url: '/addlist',
//       data: {id: $scope.id, nome: $scope.nome}
//     })
//   .then(function Success(res){
//     console.log(res);
//     toastr.success('Lista aggiunta con successo!');
//     $location.url('/lists');
//   }, function Error(res){
//     console.log(res);
//     toastr.error('Errore, controllare i dati o ID già esistente');
//   });
//   };
// })
