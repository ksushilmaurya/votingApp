
var votingApp = angular.module('votingApp', []);

votingApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/Login', {
            templateUrl: './views/login.html',
            controller: 'loginController'
        }).
        when('/Home', {
            templateUrl: './views/polling.html',
            controller: 'pollingController'
        }).
        when('/Logout', {
            templateUrl: './views/login.html',
            controller: 'logoutController'
        }).
        when('/Poll/:pollId', {
            templateUrl: './views/pollingDetails.html',
            controller: 'pollingDetailsController'
        }).
        otherwise({
            redirectTo: '/Login'
        });
    }]);







