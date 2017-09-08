SELECT t.trip_id, t.duration, ss.name as start_station, ss.lat as start_lat, ss."long" as start_long, es.name as end_station, es.lat as end_lat, es."long" as end_long 
FROM data.trip t
INNER JOIN data.station ss
ON ss.name=t.start_station
INNER JOIN data.station es
ON es.name=t.end_station
LIMIT 10000
