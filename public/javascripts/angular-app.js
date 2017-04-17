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

        dc.init = function() {
            dc.notes = [];
            dc.GetByIdId = 1;
            dc.GetByIdNote = "";
            dc.GetByIdLoaded = false;
            dc.SaveSuccessful = true;
            dc.ErrorMessage = "";
            dc.CreateNote = "";
        }

        dc.getAllNotes = function() {
            console.log('reading from db');
            $http.get('/api/')
                .then(function(data) {
                    dc.notes = data.data;
                }, function(err) {
                    console.log("GetAllNotes - ERROR", err);
                });
        };

        dc.getNoteById = function() {
            dc.GetByIdLoaded = false;
            $http.get(`/api/${dc.GetByIdId}`)
                .then(function(data) {
                    dc.GetByIdNote = data.data.note;
                    dc.GetByIdLoaded = true;
                }, function(err) {
                    console.log("GetNoteById - ERROR", err);
                });
        };

        dc.saveNote = function() {
            dc.SaveSuccessful = false;
            $http.put(`/api/${dc.GetByIdId}`, dc.GetByIdNote)
                .then(function(data) {
                    dc.SaveSuccessful = true;
                }, function(err) {
                    console.log("SaveNote - ERROR", err);
                });
        };

        dc.createNote = function() {
            dc.SaveSuccessful = false;
            $http.post('/api/', JSON.stringify({ note: dc.CreateNote }))
                .then(function(data) {
                    dc.SaveSuccessful = true;
                }, function(err) {
                    console.log("CreateNote - ERROR", err);
                });
        };

        dc.init();
    }]);