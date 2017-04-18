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
            nc.getAllNotes();
            // nc.GetByIdId;
            // nc.GetByIdNote = "";
            // nc.GetByIdLoaded = false;
            nc.clearAlerts();
            nc.ErrorMessage = "";
            nc.CreateNote = "";
            nc.Saving = false;
        }

        nc.getAllNotes = function() {
            nc.notes = [];
            nc.LoadAllComplete = false;
            nc.clearAlerts();
            $http.get('/api/')
                .then(function(data) {
                    nc.notes = data.data;
                }, function(err) {
                    nc.ErrorMessage = "retrieving all the notes";
                    console.log("GetAllNotes - ERROR", err);
                })
                .then(() => nc.LoadAllComplete = true);
        };

        // nc.getNoteById = function() {
        //     nc.clearAlerts();
        //     nc.GetByIdLoaded = false;
        //     $http.get(`/api/${nc.GetByIdId}`)
        //         .then(function(data) {
        //             nc.GetByIdNote = data.data.note;
        //             nc.GetByIdLoaded = true;
        //         }, function(err) {
        //             nc.ErrorMessage = `retrieving the note with Id ${nc.GetByIdId}`;
        //             console.log("GetNoteById - ERROR", err);
        //         });
        // };

        nc.saveNote = function(note) {
            nc.clearAlerts();
            nc.Saving = true;
            $http.put(`/api/${note.id}`, JSON.stringify(note))
                .then(function(data) {
                    nc.SaveSuccessful = true;
                }, function(err) {
                    nc.ErrorMessage = "saving the note";
                    console.log("SaveNote - ERROR", err);
                })
                .then(() => nc.getAllNotes())
                .then(() => {
                    nc.Saving = false;
                });
        };

        nc.createNote = function() {
            nc.clearAlerts();
            nc.Saving = true;
            $http.post('/api/', JSON.stringify({ note: nc.CreateNote }))
                .then(function(data) {
                    nc.SaveSuccessful = true;
                }, function(err) {
                    nc.ErrorMessage = "creating the note";
                    console.log("CreateNote - ERROR", err);
                })
                .then(() => nc.getAllNotes())
                .then(function() {
                    nc.Saving = false;
                    $('#createModal').modal('hide');
                });
        };

        nc.editNote = function(note) {
            nc.clearAlerts();
            note.editing = true;
        };

        nc.clearAlerts = function() {
            nc.SaveSuccessful = false;
            nc.ErrorMessage = "";
        }

        nc.init();
    }]);