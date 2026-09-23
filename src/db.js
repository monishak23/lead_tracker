require('dotenv').config();
const { Pool } = require('pg');

const useSSL = process.env.DB_SSL === 'true';
 
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'lead_gen',
  ssl: useSSL ? { rejectUnauthorized: false } : false,
});

module.exports = pool;