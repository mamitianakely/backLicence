const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'urbanisme',
    password: 'mamy',
    port: '5432',
});

const connectToDatabase = async () => {
  try {
    await pool.connect();
    console.log('Connected to PostgreSQL');
  } catch (err) {
    console.error('Database connection error', err.stack);
  }
};

module.exports = { pool, connectToDatabase };
