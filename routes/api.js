var db = require('../schema/dataAccess');
var express = require('express');
var router = express.Router();

let tm = require('../public/service-clients/ticketmaster.js');

var dbConnectString = process.env.SQLAZURECONNSTR_defaultConnection;
var table = process.env.NoteTable;

/* Notes. */
router.get('/notes/', function(req, res, next) {
    db.GetAll((result) => res.status(200).json(result.sort(function(a, b) { return parseInt(a.id) - parseInt(b.id); })));
});
router.get('/notes/:id', function(req, res, next) {
    db.GetById(parseInt(req.params.id), (result) => {
        if (result) {
            res.status(200).json(result[0]);
        } else {
            res.status(404).json(`There is no note with Id: ${req.params.id}`);
        }
    });
});
router.post('/notes/', function(req, res, next) {
    db.Create(req.body, result => res.status(201).json(result));
});
router.put('/notes/:id', function(req, res, next) {
    db.Update(parseInt(req.params.id), req.body, result => res.status(200).json(result));
});
/* END Notes. */


/* Ticketmaster. */
router.get('/ticketmaster/', (req, res, next) => {
    tm.GetAllEvents();
});
/* END Ticketmaster */

module.exports = router;