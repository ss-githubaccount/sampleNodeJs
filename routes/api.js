var express = require('express');
var router = express.Router();

var dbNotes = [];

/* GET home page. */
router.get('/', function(req, res, next) {
    res.status(200).json(dbNotes);
});
router.get('/{id}', function(req, res, next) {
    res.status(200).json(dbNotes.filter(function(n) {
        return n.id === id;
    }));
});
router.post('/', function(req, res, next) {
    var newId = Math.max.apply(Math.array.map(function(n) { return n.id; })) + 1;
    dbNotes.push({
        id: newId,
        note: req.params.body
    });
});

module.exports = router;