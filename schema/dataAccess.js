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
    if (rowCount === 0) {
        callback(null);
    } else {
        callback(parseResults(rows));
    }
};

var attachParams = function(id, note, request) {
    request.addParameter('id', TYPES.Int, id);
    request.addParameter('note', TYPES.VarChar, note.note);
}

var createNoteEntry = function(id, note, callback) {
    var request = new Request(`INSERT INTO ${tableName} VALUES (@id, @note)`, function(err, rowCount, rows) {
        handleDbResult(err, rowCount, rows, result => callback(result));
    });
    attachParams(id, note, request);
    conn.execSql(request);
}

var getNoteEntryById = function(id, callback) {
    var request = new Request(`SELECT * FROM ${tableName} WHERE id = @id`, function(err, rowCount, rows) {
        handleDbResult(err, rowCount, rows, callback);
    });
    attachParams(id, '', request);
    conn.execSql(request);
}

var db = {
    "GetAll": function(callback) {
        var request = new Request(`SELECT * FROM ${tableName}`, function(err, rowCount, rows) {
            handleDbResult(err, rowCount, rows, callback);
        });
        conn.execSql(request);
    },
    "GetById": function(id, callback) {
        getNoteEntryById(id, callback);
    },
    "Create": function(note, callback) {
        getNextId(function(id) {
            var request = new Request(`INSERT INTO ${tableName} VALUES (@id, @note)`, function(err, rowCount, rows) {
                handleDbResult(err, rowCount, rows, result => callback(result));
            });
            attachParams(id, note, request);
            conn.execSql(request);
        });
    },
    "Update": function(id, note, callback) {
        getNoteEntryById(id, function(result) {
            if (result) {
                var request = new Request(`UPDATE ${tableName} SET note = @note WHERE id = @id`, function(err, rowCount, rows) {
                    handleDbResult(err, rowCount, rows, result => callback(result));
                });
                attachParams(id, note, request);
                conn.execSql(request);
            } else {
                createNoteEntry(id, note, callback);
            }
        });
    }
};

module.exports = db;