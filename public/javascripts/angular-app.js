angular.module('sampleApp', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: '../partials/test-partial.html',
            controller: 'indexController'
        })
    }])
    .controller('indexController', ['$scope', function($scope) {
        console.log("starting controller");
    }]);