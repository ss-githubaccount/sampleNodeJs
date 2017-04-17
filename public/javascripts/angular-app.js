angular.module('sampleApp', ['ngRoute'])
    .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
        $routeProvider.when('/', {
                templateUrl: '../partials/home.html',
                controller: 'indexController as ic'
            })
            .when('/dictionary', {
                templateUrl: '../partials/dictionary.html',
                controller: 'dictionaryController as dc'
            });
    }])
    .controller('indexController', ['$scope', function($scope) {
        console.log("starting controller");
    }])
    .controller('dictionaryController', ['$scope', '$http', function($scope, $http) {
        console.log("starting dictionary controller");
        var dc = this;

        dc.getAllNotes = function() {
            console.log('reading from db');
            $http.get('/api/')
                .then(function(data) {
                    console.log("success", data);
                }, function(err) {
                    console.log("err", err);
                });
        };
    }]);