votingApp.controller('pollingController', function($scope, $http, $location) {

    $scope.message = 'This is pollingController';
    $scope.poll = {};

    var accessToken;

    var initFunction = function() {
        console.log("in init function");
        var isLoggedIn = localStorage.getItem('isLoggedIn');
        console.log("isLogged is - ",isLoggedIn);
        if(! Number(isLoggedIn)) {
            $location.path('/Login');
        }
        accessToken = localStorage.getItem('userAccessToken');
        $scope.getPolls();
    }


    $scope.getPolls = function() {
        $http({
            method  : "POST",
            url     : "http://54.202.88.101:3000/listPoll",
            data    : {"accessToken" : accessToken}
        }).then(function mySuccess(response) {
            console.log("response is - ",response);
            if(response.data) {
                if(response.data.status == 200) {
                    if(response.data.data.length > 0) {
                        $scope.pollList = response.data.data;
                    } else {
                        alert("No polls found create some");
                    }
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



    $scope.createPoll = function() {

        console.log("poll is ",$scope.poll);
        $scope.poll.accessToken = accessToken;
        $http({
            method  : "POST",
            url     : "http://54.202.88.101:3000/createPoll",
            data    : $scope.poll
        }).then(function mySuccess(response) {
            console.log("response is - ",response);
            if(response.data) {
                if(response.data.status == 200) {
                    alert("polls successfully created");
                    $scope.getPolls();
                    $scope.poll = {};
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

    $scope.removePoll = function(pollId) {
        console.log("pollId is - ",pollId);
        var pollObj = {
            accessToken : accessToken,
            pollId : pollId
        }
        $http({
            method  : "POST",
            url     : "http://54.202.88.101:3000/removePoll",
            data    : pollObj
        }).then(function mySuccess(response) {
            console.log("response is - ",response);
            if(response.data) {
                if(response.data.status == 200) {
                    alert("polls successfully deleted");
                    $scope.getPolls();
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
    initFunction();
});