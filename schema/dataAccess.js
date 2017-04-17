var connStringBuilder = require('node-connection-string-builder');
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;

var sc = new connStringBuilder(process.env.SQLAZURECONNSTR_defaultConnection);

var tableName = process.env.NoteTable;

var config = {
    userName: sc.userID,
    password: sc.password,
    server: sc.dataSource,
    options: {
        database: sc.initialCatalog,
        encrypt: true, //required for Azure
        rowCollectionOnRequestCompletion: true
    }
};

var conn = new Connection(config);

conn.on('connect', function(err) {
    if (err) {
        console.log(err);
    }
});

// conn.on('debug', function(err) {
//     console.log('debug', err);
// });

var parseResults = function(rows) {
    var results = [];
    rows.forEach(function(row) {
        var rowResult = {};
        row.forEach(function(cell) {
            rowResult[cell.metadata.colName || "value"] = cell.value;
        });
        results.push(rowResult);
    });
    return results;
};

var getNextId = function(callback) {
    var request = new Request(`SELECT MAX(id) FROM ${tableName} as newId`, function(err, rowCount, rows) {
        handleDbResult(err, rowCount, rows, function(result) {
            callback(parseInt(result[0].value || 0) + 1);
        });
    });
    conn.execSql(request);
};

var handleDbResult = function(err, rowCount, rows, callback) {
    if (err) {
        console.log(err);
    }
    callback(parseResults(rows));
};

var db = {
    "GetAll": function(callback) {
        var request = new Request(`SELECT * FROM ${tableName}`, function(err, rowCount, rows) {
            handleDbResult(err, rowCount, rows, callback);
        });
        conn.execSql(request);
    },
    "GetById": function(id, callback) {
        var request = new Request(`SELECT * FROM ${tableName} WHERE id = @id`, function(err, rowCount, rows) {
            handleDbResult(err, rowCount, rows, callback);
        });
        request.addParameter('id', TYPES.Int, id);
        conn.execSql(request);
    },
    "Create": function(note, callback) {
        getNextId(function(id) {
            var request = new Request(`INSERT INTO ${tableName} VALUES (@id, @note)`, function(err, rowCount, rows) {
                handleDbResult(err, rowCount, rows, result => callback(result));
            });
            request.addParameter('id', TYPES.Int, id);
            request.addParameter('note', TYPES.VarChar, note.note);
            conn.execSql(request);
        });
    }
};

module.exports = db;