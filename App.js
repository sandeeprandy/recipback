const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mysql = require("mysql2");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// MySQL database configuration
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false }, // Required for secure connection
});

// Connect to MySQL and check connection
db.connect((err) => {
  if (err) {
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
      }
    );
  }
});

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

    db.query(
      "INSERT INTO users (email, password, phone) VALUES (?, ?, ?)",
      [email, hashedPassword, phone],
      (err) => {
        if (err) {
          return res
            .status(400)
            .json({ message: "Email or phone number already exists." });
        }
        res.status(201).json({ message: "User registered successfully." });
      }
    );
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
