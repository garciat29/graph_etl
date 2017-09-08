var pg = require('pg');
var fs = require('fs');
var csvWriter = require('csv-write-stream');

exports.getData = function(query, connStr, cb)
{
  //executes query against specified database.
  //returns an array of dictionry objects representing each row
  var results = [];
  var rawQuery = query;
  pg.connect(connStr, function (err, client, done) {
    if (err) {
      done();
      cb('pg error');
    }
    var query = client.query(rawQuery);
    query.on('row', (row) => {
        results.push(row);
    });
    query.on('end', () => {
      done();
      cb(null, results);
    });
  });
};
