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
            })
            .when('/facebook', {
                templateUrl: '../partials/facebook.html',
                controller: 'facebookController as fc'
            })
            .when('/ticketmaster', {
                templateUrl: '../partials/ticketmaster.html',
                controller: 'ticketmasterController as tmc'
            })
            .when('/instagram', {
                templateUrl: '../partials/instagram.html',
                controller: 'instagramController as ic'
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
            $http.get('/api/notes/')
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
        //     $http.get(`/api/notes/${nc.GetByIdId}`)
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
            $http.put(`/api/notes/${note.id}`, JSON.stringify(note))
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
            $http.post('/api/notes/', JSON.stringify({ note: nc.CreateNote }))
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
    }])
    .controller('facebookController', ['$scope', '$window', function($scope, $window) {
        var fc = this;

        fc.init = function() {
            fc.facebookLogin();
        };

        fc.facebookLogin = function() {
            window.fbAsyncInit = function() {
                FB.init({
                    appId: '1305365532849952',
                    cookie: true,
                    xfbml: true,
                    version: 'v2.8'
                });
                FB.AppEvents.logPageView();
            };

            $window.checkLoginState = function() {
                FB.getLoginStatus(function(response) {
                    console.log("statusChangeResponse", response);
                    statusChangeCallback(response);
                });
            };

            function statusChangeCallback(response) {
                console.log('statusChangeCallback');
                console.log(response);
                if (response.status === 'connected') {
                    testAPI();
                } else if (response.status === 'not_authorized') {
                    document.getElementById('status').innerHTML = 'Please log ' +
                        'into this app.';
                } else {
                    document.getElementById('status').innerHTML = 'Please log ' +
                        'into Facebook.';
                }
            };

            function testAPI() {
                console.log('Welcome!  Fetching your information.... ');
                FB.api('/me', function(response) {
                    console.log('Successful login for: ' + response.name);
                    console.log('Successful login for: ' + response.id);
                    console.log('Successful login for: ' + response.picture);
                    document.getElementById('status').innerHTML =
                        'Thanks for logging in, ' + response.name + '!';
                    document.getElementById('pic').innerHTML =
                        'Your user id is : ' + response.id + "<br />" +
                        "<img src='" + "https://graph.facebook.com/" + response.id + "/picture?type=large' alt='' />";
                });
            };

            // Load the SDK asynchronously
            (function(d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) return;
                js = d.createElement(s);
                js.id = id;
                js.src = "//connect.facebook.net/en_US/sdk.js";
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));
        };

        fc.init();
    }])
    .controller('ticketmasterController', ['$scope', '$http', function($scope, $http) {
        var tmc = this;

        console.log("starting ticketmaster angular app controller");

        // make call to API controller for all events
        tmc.getAllEvents = () => {
            $http.get('/api/ticketmaster/')
                .then(response => {
                    console.log(response);
                });
        };
    }])
    .controller('instagramController', ['$scope', '$window', function($scope, $window) {
        var ic = this;

        console.log("starting instagram angular app controller");
    }])