var db = require('../schema/dataAccess');
var express = require('express');
var router = express.Router();

var dbConnectString = process.env.SQLAZURECONNSTR_defaultConnection;
var table = process.env.NoteTable;

/* GET home page. */
router.get('/', function(req, res, next) {
    db.GetAll((result) => res.status(200).json(result.sort(function(a, b) { return a.id > b.id; })));
});
router.get('/:id', function(req, res, next) {
    db.GetById(parseInt(req.params.id), (result) => res.status(200).json(result[0]));
});
router.post('/', function(req, res, next) {
    db.Create(req.body, result => res.status(201).json(result));
});

module.exports = router;