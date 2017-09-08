var endpoint='http://localhost:3000/api/'

function preview(){
  //get text from textarea, feed it into callAPI
  var rawQuery=readQueryInput();
  var urlparams='?query='+rawQuery.replace(';', '')+' LIMIT 10';
  callAPI(endpoint+'reldb'+urlparams,"", 'GET', function(err, response) {
    if (err) {
      return "";
    } else {
      writePreview(response);
    }
  });
};


function callAPI(url, params, verb, cb) {
  var xhttp = new XMLHttpRequest();
  xhttp.open(verb, url);
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.onreadystatechange = function() {
    if(xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 200) {
      xhttp.responsetype = 'text';
      console.log('successful API call');
      cb(null, xhttp.responseText);
    } else {
      cb(xhttp.statusText+ ' '+xhttp.responseText);
    }
  };
  if (verb=='GET'){
    xhttp.send(null);
  } else {
    xhttp.send(JSON.stringify(params));
  }
};


function readQueryInput() {
  var rawText = document.getElementById('rawInput').value;
  return rawText;
};

function writePreview(data) {
  //incoming data should be plain text that can be interpretted as JSON
  var outp= json2array(JSON.parse(data));
  document.getElementById('preview_output').innerHTML=outp.join('<br/>');
};

function json2array(injson) {
  //convert json format to csv
  var fields= Object.keys(injson[0]);
  //conver null to blank
  var replacer = function (key, value) { return value === null ? '' : value };
  //use maps functions to convert json to csv.
  var csv = injson.map(function(row) {
    return fields.map(function(fieldName) {
      return JSON.stringify(row[fieldName], replacer)
    }).join(',')
  });
  csv.unshift(fields.join(',')); //add header
  return csv; //add line enders
};

function loadGraph() {
  //1.write query to CSV file- readQueryInput(), then call /api/fileWriter with query as a param
  //2. Take input from node and relationship fields to generate API payload
    //new function to read input fields  and generate a payload
  //3. Run the load script
    //post /api/grabdb with payload
  var rawQuery=readQueryInput();
  var fileWriterQuery={"query": rawQuery.replace(';', '')};
  callAPI(endpoint+'fileWriter',fileWriterQuery, 'POST', function(err, response) {
    if (err) {
      return "";
    } else {
      alert(response);
      payload= getLoadQuery();
      callAPI(endpoint+'gradb', payload, 'POST', function(error, res) {
          if (error) {
          } else {
            alert('POST graDB worked');
          }
      })
    }
  });
};

function getLoadQuery() {
  //placeholder. no sense in working on until I learn front end dev
  //in the end- need to loop over node objects
  var payload= {
  "filename" : "c:/Users/garci/Documents/GitHub/graph_etl/csv_output/test.csv",
  "nodes":[{"label":"Station", "alias":"ss", "properties": {"name":"start_station", "lat":"start_lat", "long":"start_long"}},
  		{"label": "Trip", "alias":"t", "properties": {"trip_id": "trip_id", "duration": "duration"}}
  		],
  "relationships": [{"left_alias": "t", "right_alias":"ss", "rel_label":"PICKUP", "arrow_dir":"right"} ]
};
  return payload;
};
