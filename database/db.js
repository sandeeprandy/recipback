import mysql from "mysql2/promise";
import dotenv from "dotenv";

// Load environment variables from the .env file
dotenv.config();

let db = null;

export const dbInit = async () => {
  try {
    if (db) {
      console.log("✅ Database connection already initialized.");
      return db;
    }

    db = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : undefined,
    });

    console.log("✅ Database connected successfully!");
    return db;
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    throw new Error(error.message); // Throw an error instead of using `res`
  }
};

// Function to get an existing database connection
export const getDb = () => {
  if (!db) {
    throw new Error("Database connection is not initialized. Call dbInit() first.");
  }
  return db;
};
