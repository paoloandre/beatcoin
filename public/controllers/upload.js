angular.module('productEditor')
.controller('uploader', function($scope, $http, $timeout, $interval, $window){
  var polling;
  var content;
  //* File upload
  $scope.uploadsuccess = false;
  $scope.isRouteLoading = false;
  $scope.uploadFile = function(files) {
    $scope.isRouteLoading = true;
    var fd = new FormData();
    //Take the first selected file
    fd.append("file", files[0]);
    $http.post('/upload', fd, {
      withCredentials: true,
      headers: {'Content-Type': undefined },
      transformRequest: angular.identity
    })
    //* File upload results
    .then(function successResponse(response) {
      var filename = response.data;
      filename = filename.replace("./public", "static");
      filename = filename.replace(/"/g, "");

      $http({method: 'GET',
      url: filename
    })
    .then(function successGet(filename) {
      // console.log(filename.data);
      $timeout(function () { $scope.uploadsuccess = false; }, 3000);
      $http({method: 'POST',
          url: '/insert',
          data: {shape: filename.data}
        })
        .then(function successResponse(response){
          console.log(response);
          console.log('file inserted in db');
          $scope.isRouteLoading = false;
          $scope.uploadsuccess = true;
        }, function errorResponse(response) {
          console.log(response);
          console.log('error in insert');
        });

  }, function errorGet(response) {
    console.log(response);
    console.log('error in $http.get');
  });

}, function errorResponse(response) {
  console.log(response);
  console.log('error in uploading file');
  $window.alert('Error in uploading file');
  $scope.isRouteLoading = false;
});
};
// funzione per stoppare l'interval
function stopInterval(polling){
  if (angular.isDefined(polling)) {
    $interval.cancel(polling);
    console.log('interval stopped');
    polling = undefined;
  }
};
})

.controller('getashape', function($scope, $http){
$http({method: 'GET',
url: '/shape/:id'
})
.then(function successShape(html) {
  $scope.html = html;
}, function errorShape(response){
  console.log(response);
  console.log('error in $http.get');
});
});
