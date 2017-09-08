const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/todo';

const client = new pg.Client(connectionString);
client.connect();

const query = client.query(
  'SELECT NOW() AS now');
query.on('end', () => { client.end(); });
