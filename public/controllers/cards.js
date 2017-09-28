angular.module('beatCoin')
.controller('CardsCtrl', function($scope, $http, $location, toastr){
  $http.get('/cards')
    .success(function(docs) {
      $scope.cards = docs;
    })
    .error(function(err) {
      toastr.error('Error! Something went wrong');
    });

    $scope.addCard = function(){
      $http.post('/cards', $scope.newCard)
      .success(function(){
        console.log($scope.user);
        $scope.newCard._user = $scope.user;
        $scope.cards.push($scope.newCard);
        $scope.newCard = {};
        toastr.success('Carta aggiunta con successo!');
      })
      .error(function(err){
        toastr.error('Error! Something went wrong');
      });
    };

    $scope.deleteCard = function(index){
      $http.delete('/cards/' + $scope.cards[index]._id)
      .success(function(){
        $scope.cards.splice(index, 1);
        toastr.success('Carta eliminata con successo!');
      })
      .error(function(err){
        toastr.error('Error! Something went wrong');
      });
    };

    $scope.toggleEdit = function(index){
      $scope.cards[index].edit = !$scope.cards[index].edit;
    };

    // $scope.saveCard = function(index){
    //       $http.put('/cards/' + $scope.cards[index]._id, $scope.cards[index])
    //       .success(function(){
    //         $scope.cards[index].edit = false;
    //         toastr.success('Carta aggiornata con successo!');
    //       })
    //       .error(function(err){
    //         toastr.error('Error! Something went wrong');
    //       });
    //     };

    $scope.viewDetail = function(index){
      var path = ('/objects/' + $scope.cards[index]._id);
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
