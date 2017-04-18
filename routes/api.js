var db = require('../schema/dataAccess');
var express = require('express');
var router = express.Router();

var dbConnectString = process.env.SQLAZURECONNSTR_defaultConnection;
var table = process.env.NoteTable;

/* GET home page. */
router.get('/', function(req, res, next) {
    db.GetAll((result) => res.status(200).json(result.sort(function(a, b) { return parseInt(a.id) - parseInt(b.id); })));
});
router.get('/:id', function(req, res, next) {
    db.GetById(parseInt(req.params.id), (result) => {
        if (result) {
            res.status(200).json(result[0]);
        } else {
            res.status(404).json(`There is no note with Id: ${req.params.id}`);
        }
    });
});
router.post('/', function(req, res, next) {
    db.Create(req.body, result => res.status(201).json(result));
});
router.put('/:id', function(req, res, next) {
    db.Update(parseInt(req.params.id), req.body, result => res.status(200).json(result));
});

module.exports = router;