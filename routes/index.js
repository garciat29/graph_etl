var express = require('express');
var path = require('path');
var fs = require('fs');
var csvWriter = require('csv-write-stream');
var reldb = require('../modules/relDB');
var gradb = require('../modules/gradb');
var fa = require('../modules/fileWriter');

var pgConnectionString = 'postgres://postgres:mexkimo29@localhost:5432/bike_share';
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res) {
  //res.render('index', { title: 'Express' });
  res.redirect('index.html');
});

router.get('/api/reldb', function(req,res) {
  var rawQuery = req.param('query');

  console.log('/reldb query '+JSON.stringify(req.body));
  console.log('/reldb query '+JSON.stringify(rawQuery));
  reldb.getData(rawQuery,pgConnectionString, function (err, response){
    if (err) {
      return "";
    } else {
      return res.json(response)
    }
  });
});

//write pg data to csv file
router.post('/api/fileWriter', function(req,res) {
  var rawQuery = req.body.query;
  reldb.getData(rawQuery,pgConnectionString, function (err, response){
    if (err) {
      return "";
    } else {
      //console.log(JSON.stringify(response[0]));
      fa.writeCSV(response);
      res.json({message: 'Wrote to CSV'});
    }
  });
});

//execute a load CSV command. takes in params, and
//request payload needs the following structure
//{filename: 'server_location',
//nodes: [{label:'x', alias:a, properties: {p1:"fileCol1", p2:"filecol2"} }, {label:...}],
//relationships: [{left_alias: 'x', right_alias: 'y', rel_label:'DOES', arrow_dir:'left/right/NA'}, ...]
//}
//request creates the cypher load query from payload and pushes to Neo4j API

router.post('/api/gradb', function(req,res) {
  var payload=req.body;
  gradb.getLoadQuery(payload, function(err, response) {
    if (err) {
      res.json("unable to generate load query");
    } else {
      gradb.loadToGraph(response, function(err, response) {
        if (err) {
          res.json("load query failes");
        } else {
          res.json('SUCCESSFULLY LOADED');
        }
      });
    };
  });
});


module.exports = router;
