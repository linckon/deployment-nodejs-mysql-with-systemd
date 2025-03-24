const express = require('express');
const mysql = require('mysql2/promise');
const app = express();
const port = 3000;

// Database connection configuration
const dbConfig = {
  host: 'localhost',
  user: 'app_user',
  password: 'app_password',
  database: 'practice_app'
};

// Create MySQL connection pool
const pool = mysql.createPool(dbConfig);

// Health endpoint
app.get('/health', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    connection.release();
    res.json({ status: 'healthy', database: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'unhealthy', database: 'disconnected', error: error.message });
  }
});

// Users endpoint
app.get('/users', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name, email FROM users');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
