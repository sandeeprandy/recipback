import mysql from "mysql2/promise";
import dotenv from "dotenv";

// Load environment variables from the .env file
dotenv.config();

let db = null;

export const dbInit = async () => {
  try {
    if (db) {
      console.log("Database connection already initialized.");
      return db;
    }

    // Initialize the database connection
    db = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl:
        process.env.DB_SSL === "true"
          ? { rejectUnauthorized: false }
          : undefined,
    });

    console.log("Connected to MySQL database.");

    // Ensure `users` table exists
    const [result] = await db.query("SHOW TABLES LIKE 'users'");
    if (result.length === 0) {
      await db.query(`
        CREATE TABLE users (
          id INT PRIMARY KEY AUTO_INCREMENT,
          email VARCHAR(255) UNIQUE NOT NULL,
          password TEXT NOT NULL,
          phone VARCHAR(20) NOT NULL
        );
      `);
      console.log("Users table created successfully.");
    }

    return db;
  } catch (err) {
    console.error("Database connection error:", err.message);
    process.exit(1); // Exit the process if DB initialization fails
  }
};

export const getDb = () => {
  if (!db) {
    throw new Error(
      "Database connection is not initialized. Call dbInit() first."
    );
  }
  return db;
};
