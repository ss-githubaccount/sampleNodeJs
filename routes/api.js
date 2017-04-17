var express = require('express');
var router = express.Router();

var dbNotes = [];

/* GET home page. */
router.get('/', function(req, res, next) {
    dbNotes.push({ "sql database": process.env.SQLAZURECONNSTR_defaultConnection });
    dbNotes.push({ "sql server": process.env.SQLCONNSTR_defaultConnection });
    dbNotes.push({ "mysql": process.env.MYSQLCONNSTR_defaultConnection });
    dbNotes.push({ "custom": process.env.CUSTOM_CONNSTR_defaultConnection });
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