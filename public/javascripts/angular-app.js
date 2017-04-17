angular.module('sampleApp', ['ngRoute'])
    .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
        $routeProvider.when('/', {
                templateUrl: '../partials/home.html',
                controller: 'indexController as ic'
            })
            .when('/notes', {
                templateUrl: '../partials/notes.html',
                controller: 'notesController as nc'
            });
    }])
    .controller('indexController', ['$scope', function($scope) {
        var ic = this;

        ic.init = function() {
            // do nothing
        };

        ic.init();
    }])
    .controller('notesController', ['$scope', '$http', function($scope, $http) {
        var nc = this;

        nc.init = function() {
            nc.notes = [];
            nc.GetByIdId;
            nc.GetByIdNote = "";
            nc.GetByIdLoaded = false;
            nc.SaveSuccessful = true;
            nc.ErrorMessage = "";
            nc.CreateNote = "";
        }

        nc.getAllNotes = function() {
            $http.get('/api/')
                .then(function(data) {
                    nc.notes = data.data;
                }, function(err) {
                    console.log("GetAllNotes - ERROR", err);
                });
        };

        nc.getNoteById = function() {
            nc.GetByIdLoaded = false;
            $http.get(`/api/${nc.GetByIdId}`)
                .then(function(data) {
                    nc.GetByIdNote = data.data.note;
                    nc.GetByIdLoaded = true;
                }, function(err) {
                    console.log("GetNoteById - ERROR", err);
                });
        };

        nc.saveNote = function() {
            nc.SaveSuccessful = false;
            $http.put(`/api/${nc.GetByIdId}`, JSON.stringify({ note: nc.GetByIdNote }))
                .then(function(data) {
                    nc.SaveSuccessful = true;
                }, function(err) {
                    console.log("SaveNote - ERROR", err);
                });
        };

        nc.createNote = function() {
            nc.SaveSuccessful = false;
            $http.post('/api/', JSON.stringify({ note: nc.CreateNote }))
                .then(function(data) {
                    nc.SaveSuccessful = true;
                }, function(err) {
                    console.log("CreateNote - ERROR", err);
                });
        };

        nc.init();
    }]);