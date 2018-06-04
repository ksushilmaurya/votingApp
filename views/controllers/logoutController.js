votingApp.controller('logoutController', function($scope, $http, $location) {
    window.localStorage.setItem("isLoggedIn", 0);
    window.localStorage.setItem("userAccessToken", null);
    console.log("djghjghfdgjhfdgj")
    $location.path('/Login');
});