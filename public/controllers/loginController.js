votingApp.controller('loginController', function($scope, $http, $location) {
    $scope.user = {};
    $scope.showLoginPage = true;

    $scope.login = function() {
        console.log("in login - ",$scope.user)
        if(!$scope.user.username) {
            alert("Username is required");
            return;
        }
        if(!$scope.user.password) {
            alert("Password is required");
            return;
        }

        $http({
            method  : "POST",
            url     : "http://54.202.88.101:3000/login",
            data    : $scope.user
        }).then(function mySuccess(response) {
            console.log("response is - ",response);
            if(response.data) {
                if(response.data.status == 200) {
                    window.localStorage.setItem("isLoggedIn", 1);
                    window.localStorage.setItem("userAccessToken", response.data.data.accessToken);
                    $scope.showLoginPage = false;
                    $location.path('/Home');
                } else {
                    alert(response.data.message);
                }
            } else {
                alert("Something went wrong. Please try again later");
            }
        }, function myError(response) {
            alert("Something went wrong. Please try again later");
        });
    }

});