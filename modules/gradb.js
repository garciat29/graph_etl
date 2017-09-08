var request = require('request');

exports.getLoadQuery= function(payload, cb)
{
  var load_query="USING PERIODIC COMMIT 1000 LOAD CSV WITH HEADERS FROM  'file:///"+ payload.filename+ "' AS line " ;
  payload.nodes.forEach(function(node) {
    //create properties string and add 'line' prefix for identification
    //a key-value pair of property name->column from file
    var prop_string='{'
    var first = true;
    for (var prop in node.properties) {
      if (first){
        prop_string=prop_string+prop+': line.'+node.properties[prop];
        first = false;
      } else {
        prop_string=prop_string+', '+prop+': line.'+node.properties[prop];
      }
    }
    prop_string=prop_string+'}';
    //add merge for this label into the load query
    load_query=load_query+'MERGE ('+node.alias+':'+node.label+' '+prop_string+') ';
  });
  //add in relationship merge statements
  payload.relationships.forEach(function(rel){
    var rel_merge = ''
    if (rel.arrow_dir == "right") {
      rel_merge="MERGE (%left_alias%)-[:%rel_label%]->(%right_alias%) "
    } else if (rel.arrow_dir == "left") {
      rel_merge="MERGE (%left_alias%)<-[:%rel_label%]-(%right_alias%) "
    } else if (rel.arrow_dir == "na") {
      rel_merge="MERGE (%left_alias%)-[:%rel_label%]-(%right_alias%) "
    }
    rel_merge= rel_merge.replace('%left_alias%', rel.left_alias);
    rel_merge= rel_merge.replace('%right_alias%', rel.right_alias);
    rel_merge= rel_merge.replace('%rel_label%', rel.rel_label);
    load_query=load_query+rel_merge;
  });
  cb(null, load_query);
};

exports.loadToGraph= function(query, cb) {
//POST http://localhost:7474/db/data/transaction/commit
//Accept: application/json; charset=UTF-8
//Content-Type: application/json
//so insecure right here
  var secKey="bmVvNGo6bWV4a2ltbzI5";
  var statement={"statements": [{"statement" : query}]};
  request.post({
    headers:{"content-type": "application/json", "Authorization":"Basic "+secKey},
    url: "http://localhost:7474/db/data/transaction/commit",
    body: statement,
    json:true
  }, function(error, response, body){
    console.log('start of request post callback');
    if (error) {
      cb(error, null);
    }
    else {
      cb(null, response);
    }
  });
};
