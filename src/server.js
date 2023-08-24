require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const path = require('path');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'client/build')));

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    process.exit(1);
  }
  console.log('Connected to the database');
});

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

app.get('/api/announcements', (req, res) => {
  const query = 'SELECT * FROM announcements';

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error retrieving announcements:', err);
      res.status(500).json({ error: 'Failed to retrieve announcements' });
      return;
    }

    res.json(results);
  });
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  const adminQuery = 'SELECT * FROM admins WHERE username = ?';
  const showAdminQuery = 'SELECT * FROM showadmins WHERE username = ?';

  const [adminResults, showAdminResults] = await Promise.all([
    new Promise((resolve, reject) =>
      connection.query(adminQuery, [username], (err, results) => (err ? reject(err) : resolve(results)))
    ),
    new Promise((resolve, reject) =>
      connection.query(showAdminQuery, [username], (err, results) => (err ? reject(err) : resolve(results)))
    ),
  ]);

  if (adminResults.length > 0) {
    const admin = adminResults[0];

    bcrypt.compare(password, admin.password, function(err, isMatch) {
      if (err) {
        console.error('Error while comparing passwords:', err);
        res.status(500).json({ error: 'Failed to authenticate' });
        return;
      }

      if (!isMatch) {
        console.log('Invalid password:', password);
        res.status(401).json({ error: 'Invalid password' });
        return;
      }

      const role = 'admin';

      console.log('Admin Login successful:', { username, role });
      res.json({ message: 'Login successful', role });
    });
  } else if (showAdminResults.length > 0) {
    const showadmin = showAdminResults[0];

    bcrypt.compare(password, showadmin.password, function(err, isMatch) {
      if (err) {
        console.error('Error while comparing passwords:', err);
        res.status(500).json({ error: 'Failed to authenticate' });
        return;
      }

      if (!isMatch) {
        console.log('Invalid password:', password);
        res.status(401).json({ error: 'Invalid password' });
        return;
      }

      const role = 'showadmin';

      console.log('ShowAdmin Login successful:', { username, role });
      res.json({ message: 'Login successful', role });
    });
  } else {
    res.status(401).json({ error: 'Invalid username' });
  }
});

app.get('/api/showadmins', (req, res) => {
  const query = 'SELECT username FROM showadmins';

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error retrieving show admins:', err);
      res.status(500).json({ error: 'Failed to retrieve show admins' });
      return;
    }

    res.json(results);
  });
});

app.get('/api/admins', (req, res) => {
  const query = 'SELECT username FROM admins';

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error retrieving admins:', err);
      res.status(500).json({ error: 'Failed to retrieve admins' });
      return;
    }

    res.json(results);
  });
});

app.put('/api/showadmins/:username', async (req, res) => {
  const { username } = req.params;

  const showAdminQuery = 'SELECT * FROM showadmins WHERE username = ?';
  connection.query(showAdminQuery, [username], (err, results) => {
    if (err || results.length === 0) {
      console.error('Error retrieving show admin:', err);
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const { password } = results[0];

    const deleteShowAdminQuery = 'DELETE FROM showadmins WHERE username = ?';
    connection.query(deleteShowAdminQuery, [username], (err) => {
      if (err) {
        console.error('Error deleting show admin:', err);
        res.status(500).json({ error: 'Failed to update admin status' });
        return;
      }

      const addAdminQuery = 'INSERT INTO admins (username, password) VALUES (?, ?)';
      connection.query(addAdminQuery, [username, password], (err) => {
        if (err) {
          console.error('Error adding admin:', err);
          res.status(500).json({ error: 'Failed to update admin status' });
          return;
        }

        res.json({ message: 'Admin status updated' });
      });
    });
  });
});

app.get('/api/users', async (req, res) => {
  const adminQuery = 'SELECT username, \'admin\' as role FROM admins';
  const showAdminQuery = 'SELECT username, \'showadmin\' as role FROM showadmins';

  const [adminResults, showAdminResults] = await Promise.all([
    new Promise((resolve, reject) => 
      connection.query(adminQuery, (err, results) => (err ? reject(err) : resolve(results)))
    ),
    new Promise((resolve, reject) => 
      connection.query(showAdminQuery, (err, results) => (err ? reject(err) : resolve(results)))
    ),
  ]);

  const allUsers = [...adminResults, ...showAdminResults];

  res.json(allUsers);
});

app.post(
  '/api/changePassword', 
  [
    body('username').notEmpty().withMessage('Username is required').bail().isString().withMessage('Username must be a string'),
    body('password').notEmpty().withMessage('Password is required').bail().isString().withMessage('Password must be a string'),
    body('role').notEmpty().withMessage('Role is required').bail().isIn(['admin', 'showadmin']).withMessage('Invalid user role')
  ], 
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { username, password, role } = req.body;
  
    const hashedPassword = await bcrypt.hash(password, 10);

    let updateQuery;
    if (role === 'showadmin') {
      updateQuery = 'UPDATE showadmins SET password = ? WHERE username = ?';
    } else if (role === 'admin') {
      updateQuery = 'UPDATE admins SET password = ? WHERE username = ?';
    } else {
      return;
    }

    connection.query(updateQuery, [hashedPassword, username], (err) => {
      if (err) {
        console.error('Error updating password:', err);
        res.status(500).json({ error: 'Failed to update password' });
        return;
      }
  
      res.json({ message: 'Password updated successfully' });
    });
  }
);

app.put('/api/makeAdmin/:username', async (req, res) => {
  const { username } = req.params;

  // First, we need to get the password of the showadmin who is being made an admin
  const showAdminQuery = 'SELECT * FROM showadmins WHERE username = ?';
  connection.query(showAdminQuery, [username], (err, results) => {
    if (err || results.length === 0) {
      console.error('Error retrieving show admin:', err);
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const { password } = results[0];

    // Delete the user from the showadmins table
    const deleteShowAdminQuery = 'DELETE FROM showadmins WHERE username = ?';
    connection.query(deleteShowAdminQuery, [username], (err) => {
      if (err) {
        console.error('Error deleting show admin:', err);
        res.status(500).json({ error: 'Failed to update admin status' });
        return;
      }

      // Add the user to the admins table
      const addAdminQuery = 'INSERT INTO admins (username, password) VALUES (?, ?)';
      connection.query(addAdminQuery, [username, password], (err) => {
        if (err) {
          console.error('Error adding admin:', err);
          res.status(500).json({ error: 'Failed to update admin status' });
          return;
        }

        res.json({ message: 'Admin status updated' });
      });
    });
  });
});

app.put('/api/removeAdmin/:username', async (req, res) => {
  const { username } = req.params;

  const deleteAdminQuery = 'DELETE FROM admins WHERE username = ?';
  connection.query(deleteAdminQuery, [username], (err) => {
    if (err) {
      console.error('Error deleting admin:', err);
      res.status(500).json({ error: 'Failed to remove admin' });
      return;
    }

    res.json({ message: 'Admin removed' });
  });
});

app.post('/api/createUser',
  [
    body('username').notEmpty().withMessage('Username is required').bail().isString().withMessage('Username must be a string'),
    body('password').notEmpty().withMessage('Password is required').bail().isString().withMessage('Password must be a string'),
    body('role').notEmpty().withMessage('Role is required').bail().isIn(['admin', 'showadmin']).withMessage('Invalid user role')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    let insertQuery;
    if (role === 'showadmin') {
      insertQuery = 'INSERT INTO showadmins (username, password) VALUES (?, ?)';
    } else if (role === 'admin') {
      insertQuery = 'INSERT INTO admins (username, password) VALUES (?, ?)';
    } else {
      return;
    }

    connection.query(insertQuery, [username, hashedPassword], (err) => {
      if (err) {
        console.error('Error creating user:', err);
        res.status(500).json({ error: 'Failed to create user' });
        return;
      }

      res.json({ message: 'User created successfully' });
    });
  }
);


app.put('/api/removeShowAdmin/:username', async (req, res) => {
  const { username } = req.params;

  const deleteShowAdminQuery = 'DELETE FROM showadmins WHERE username = ?';
  connection.query(deleteShowAdminQuery, [username], (err) => {
    if (err) {
      console.error('Error deleting show admin:', err);
      res.status(500).json({ error: 'Failed to remove show admin' });
      return;
    }

    res.json({ message: 'Show admin removed' });
  });
});

app.put('/api/schools/:id', (req, res) => {
  const { id } = req.params;
  const { latitude, longitude } = req.body;

  const updateQuery = 'UPDATE schools SET latitude = ?, longitude = ? WHERE id = ?';

  connection.query(updateQuery, [latitude, longitude, id], (err, results) => {
    if (err) {
      console.error('Error updating latitude and longitude:', err);
      res.status(500).json({ error: 'Failed to update latitude and longitude' });
      return;
    }

    res.json({ message: 'Latitude and longitude updated successfully' });
  });
});

// Remove a college
app.delete('/api/schools/:id', (req, res) => {
  const { id } = req.params;

  const deleteQuery = 'DELETE FROM schools WHERE id = ?';

  connection.query(deleteQuery, [id], (err, results) => {
    if (err) {
      console.error('Error removing college:', err);
      res.status(500).json({ error: 'Failed to remove college' });
      return;
    }

    res.json({ message: 'College removed successfully' });
  });
});

// Add a new college
app.post('/api/schools', (req, res) => {
  const {
    college_name,
    state_name,
    active_riders,
    is_anchor_school,
    region_number,
    zone_number,
    mileage,
    latitude,
    longitude,
  } = req.body;

  const insertQuery = 'INSERT INTO schools (college_name, state_name, active_riders, is_anchor_school, region_number, zone_number, mileage, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';

  connection.query(
    insertQuery,
    [
      college_name,
      state_name,
      active_riders,
      is_anchor_school,
      region_number,
      zone_number,
      mileage,
      latitude,
      longitude,
    ],
    (err, results) => {
      if (err) {
        console.error('Error adding college:', err);
        res.status(500).json({ error: 'Failed to add college' });
        return;
      }

      res.json({ message: `Successfully added "${college_name}"` });
    }
  );
});


app.listen(process.env.PORT || 8000, () => {
  console.log(`Server is running on port ${process.env.PORT || 8000}`);
});
