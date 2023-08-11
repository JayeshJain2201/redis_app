const { Pool } = require('pg'); 

// Create connection pool
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME,
  password: process.env.DB_PASS || 'password',
  port: process.env.DB_PORT
});

module.exports = { pool };