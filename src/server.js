const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

const app = express();

app.use(cors());
app.use(express.json());

// Create a MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '12345678',
  database: 'rihs',
  port: '3306'
});

// Connect to the MySQL database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    process.exit(1); // Exit the process with failure status
  }
  console.log('Connected to the database');
});

// Define the API routes

// Get all events
app.get('/api/events', (req, res) => {
  const query = 'SELECT * FROM events';

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error retrieving events:', err);
      res.status(500).json({ error: 'Failed to retrieve events' });
      return;
    }

    res.json(results);
  });
});

// Get all schools
app.get('/api/schools', (req, res) => {
  const query = 'SELECT * FROM schools';

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error retrieving schools:', err);
      res.status(500).json({ error: 'Failed to retrieve schools' });
      return;
    }

    res.json(results);
  });
});

// Start the server
const port = 8000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
