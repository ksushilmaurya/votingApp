votingApp.controller('pollingDetailsController', function($scope, $http, $routeParams, $location) {

    $scope.message = 'This is pollingController';
    $scope.dataPoints = [];
    $scope.selectedName = "";
    $scope.addNewName = "";
    $scope.newOption = "";

    $scope.currentPollId = "";

    var accessToken;
    var initFunction = function() {
        console.log("in init function");
        var isLoggedIn = localStorage.getItem('isLoggedIn');
        console.log("isLogged is - ",isLoggedIn);
        if(! Number(isLoggedIn)) {
            $location.path('/Login');
        }
        accessToken = localStorage.getItem('userAccessToken');

        console.log("accessToken is - ",accessToken)
        $scope.getPollById();
    }

    $scope.getPollById = function() {
        $http({
            method  : "POST",
            url     : "http://54.202.88.101:3000/viewPollById",
            data    : {"accessToken" : accessToken, pollId : $routeParams.pollId}
        }).then(function mySuccess(response) {
            console.log("response is - ",response);
            if(response.data) {
                if(response.data.status == 200) {
                        $scope.pollDetails = response.data.data;
                        $scope.optionsArray = response.data.data.options;
                        $scope.currentPollId = $scope.pollDetails._id;
                        $scope.dataPoints.length = 0;
                        console.log("$scope.selectedName - ",$scope.selectedName);
                        createDataPoints();
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

    $scope.vote = function() {

        if(!$scope.selectedName || $scope.selectedName.length<1) {
            alert("Please select any option");
            return;
        }

        console.log("selectedName - ",$scope.selectedName,$scope.currentPollId);
        $http({
            method  : "POST",
            url     : "http://54.202.88.101:3000/vote",
            data    : {"accessToken" : accessToken, pollId :$routeParams.pollId, name: $scope.selectedName}
        }).then(function mySuccess(response) {
            console.log("response is - ",response);
            if(response.data) {
                if(response.data.status == 200) {
                    alert("Successfully voted");
                    //$scope.dataPoints.length = 0;
                    //createDataPoints();
                    $scope.getPollById();
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



    var createDataPoints = function() {
        console.log("in create ------- ")
        for(var i=0; i<$scope.optionsArray.length; i++) {
            $scope.dataPoints.push({
                y : $scope.optionsArray[i].voteCount ||0,
                label : $scope.optionsArray[i].name
            })
        }
        console.log("$scope.dataPoints - ",$scope.dataPoints);
        var options = {
            animationEnabled: true,
            data: [{
                type: "pie",
                startAngle: 40,
                toolTipContent: "<b>{label}</b>: {y}",
                showInLegend: "true",
                legendText: "{label}",
                indexLabelFontSize: 16,
                indexLabel: "{label} - {y}",
                dataPoints: $scope.dataPoints
            }]
        };
        $("#chartContainer").CanvasJSChart(options);
    }

    $scope.addOption = function() {

        if(!$scope.newOption) {
            alert("Please enter option");
            return;
        }

        $http({
            method  : "POST",
            url     : "http://54.202.88.101:3000/addOption",
            data    : {"accessToken" : accessToken, pollId :$routeParams.pollId, name: $scope.newOption}
        }).then(function mySuccess(response) {
            console.log("response is - ",response);
            if(response.data) {
                if(response.data.status == 200) {
                    alert("Successfully added");
                    $scope.newOption = "";
                    $scope.getPollById();
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