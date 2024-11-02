<<<<<<< HEAD
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
=======
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mysql = require("mysql2");
require("dotenv").config();
>>>>>>> caf93ac (add .env file and git igone)

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

<<<<<<< HEAD
// SQLite database initialization
const db = new sqlite3.Database('database.db'); // In-memory database for simplicity
=======
// MySQL database configuration
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false }, // Required for secure connection
});
>>>>>>> caf93ac (add .env file and git igone)

// Check if the users table exists before trying to create it
db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='users'", (err, row) => {
  if (err) {
<<<<<<< HEAD
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
=======
    console.error("Database connection error:", err.stack);
    return;
  }
  console.log("Connected to MySQL database.");
});

// Check if the users table exists and create if it doesn’t
db.query("SHOW TABLES LIKE 'users'", (err, result) => {
  if (err) {
    console.error("Error checking users table:", err.message);
    return;
  }
  if (result.length === 0) {
    db.query(
      `CREATE TABLE users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        email VARCHAR(255) UNIQUE,
        password TEXT,
        phone VARCHAR(20)
      )`,
      (err) => {
        if (err) {
          console.error("Error creating users table:", err.message);
        } else {
          console.log("Users table created successfully.");
        }
>>>>>>> caf93ac (add .env file and git igone)
      }
    });
  }
});

<<<<<<< HEAD
app.get("/data" , async (req, res) =>  {
  const data = await db.all("SELECT * FROM users");
  res.send(data);


})
app.get('/products', (req, res) => {

  const products = require('./data/products.json');
=======
// Routes
app.get("/data", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) {
      res.status(500).json({ message: "Error retrieving data" });
    } else {
      res.json(results);
    }
  });
});

app.get("/products", (req, res) => {
  const products = require("./data/products.json");
>>>>>>> caf93ac (add .env file and git igone)
  res.json(products);
});

// Register route
app.post("/register", async (req, res) => {
  const { email, password, phone } = req.body;

  // Simple input validation
  if (!email || !password || !phone) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields." });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

<<<<<<< HEAD
    // Insert user into the database
    db.run("INSERT INTO users (email, password, phone) VALUES (?, ?, ?)", [email, hashedPassword, phone], function(err) {
      if (err) {
        return res.status(400).json({ message: 'Email or phone number already exists.' });
=======
    db.query(
      "INSERT INTO users (email, password, phone) VALUES (?, ?, ?)",
      [email, hashedPassword, phone],
      (err, result) => {
        if (err) {
          return res
            .status(400)
            .json({ message: "Email or phone number already exists." });
        }
        res.status(201).json({ message: "User registered successfully." });
>>>>>>> caf93ac (add .env file and git igone)
      }
      res.status(201).json({ message: 'User registered successfully.' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Login route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Simple input validation
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide email and password." });
  }

  try {
<<<<<<< HEAD
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
=======
    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, results) => {
        if (err || results.length === 0) {
          return res.status(401).json({ message: "User does not exist." });
        }

        const user = results[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return res.status(401).json({ message: "Invalid password." });
        }

        const token = jwt.sign(
          { id: user.id, email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        res.status(200).json({ token });
      }
    );
>>>>>>> caf93ac (add .env file and git igone)
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
