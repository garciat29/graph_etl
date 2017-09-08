

//LOAD CSV WITH HEADERS FROM 'file:///c:/Users/garci/Documents/GitHub/graph_etl/csv_output/test.csv' AS line

USING PERIODIC COMMIT 1000
LOAD CSV WITH HEADERS FROM 'file:///c:/Users/garci/Documents/GitHub/graph_etl/csv_output/test.csv' AS line
//create stations
MERGE (ss:Station {name: line.start_station, lat: line.start_lat, long: line.start_long})
MERGE (es:Station {name: line.end_station, lat: line.end_lat, long: line.end_long})
//create trips
MERGE (t:Trip {trip_id: line.trip_id, duration: toInt(line.duration)})
//create relationships
MERGE (t)-[:PICKUP]->(ss)
MERGE (t)-[:DROPOFF]->(es)
