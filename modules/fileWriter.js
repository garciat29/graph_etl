var fs = require('fs');
var csvWriter = require('csv-write-stream');

exports.writeCSV = function(jsondata)
{
  var writer = csvWriter();
  var outfile = fs.createWriteStream('C:/Users/garci/Documents/GitHub/graph_etl/csv_output/test.csv');
  outfile.on('open', function (fd) {
    writer.pipe(outfile);
    jsondata.forEach( function(row){
      writer.write(row);
    });
    writer.end();
  });
};
