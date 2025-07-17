const express = require('express');
const mysql = require('mysql2/promise');
const app = express();
const port = 3000;

app.use(express.json());

// MySQL connection configuration
const dbConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'user',
  password: process.env.MYSQL_PASSWORD || 'password',
  database: process.env.MYSQL_DATABASE || 'mydatabase',
};

// Initialize MySQL connection pool
const pool = mysql.createPool(dbConfig);

// Initialize database and create table
async function initializeDb() {
  try {
    const connection = await pool.getConnection();
    await connection.query(`
      CREATE TABLE IF NOT EXISTS items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Database initialized successfully');
    connection.release();
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Initialize database when app starts
initializeDb();

// Root endpoint
app.get('/', (req, res) => {
  res.send('Hello Docker with MySQL!');
});

// Add an item
app.post('/items', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const [result] = await pool.query('INSERT INTO items (name) VALUES (?)', [
      name,
    ]);
    res.status(201).json({
      message: 'Item created successfully',
      id: result.insertId,
    });
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all items
app.get('/items', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM items');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
