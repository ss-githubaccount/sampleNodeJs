var path = require('path');
var express = require('express');
var router = express.Router();

var returnIndex = (req, res, next) => {
    res.sendFile(path.resolve(__dirname, '../views/index.html'));
}

/* GET home page. */
router.get('/', returnIndex);
router.get('/notes', returnIndex);
router.get('/facebook', returnIndex);
router.get('/ticketmaster', returnIndex);
router.get('/instagram', returnIndex);

module.exports = router;