angular.module('sampleApp', ['ngRoute'])
    .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
        $routeProvider.when('/', {
            templateUrl: '../partials/test-partial.html',
            controller: 'indexController'
        });
    }])
    .controller('indexController', ['$scope', function($scope) {
        console.log("starting controller");
    }]);