const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// SQLite database initialization
const db = new sqlite3.Database('database.db'); // In-memory database for simplicity

// Check if the users table exists before trying to create it
db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='users'", (err, row) => {
  if (err) {
    console.error(err.message);
    return;
  }
  if (!row) {
    // Create users table if it doesn't exist
    db.run("CREATE TABLE users (id INTEGER PRIMARY KEY, email TEXT UNIQUE, password TEXT, phone TEXT)", (err) => {
      if (err) {
        console.error('Error creating users table:', err.message);
      } else {
        console.log('Users table created successfully.');
      }
    });
  }
});

// Register route
app.post('/register', async (req, res) => {
  const { email, password, phone } = req.body;

  // Simple input validation
  if (!email || !password || !phone) {
    return res.status(400).json({ message: 'Please provide all required fields.' });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into the database
    db.run("INSERT INTO users (email, password, phone) VALUES (?, ?, ?)", [email, hashedPassword, phone], function(err) {
      if (err) {
        return res.status(400).json({ message: 'Email or phone number already exists.' });
      }
      res.status(201).json({ message: 'User registered successfully.' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Simple input validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password.' });
  }

  try {
    // Find user by email
    db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
      if (err || !user) {
        return res.status(401).json({ message: 'User does not exist.' });
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid password.' });
      }

      // Generate JWT token
      const token = jwt.sign({ id: user.id, email: user.email }, 'secret', { expiresIn: '1h' });
      res.status(200).json({ token });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
