import { compare, hash } from "bcrypt";
import jwt from "jsonwebtoken"; // Import as default export
const { sign } = jwt; // Destructure the required function

import { getDb, dbInit } from "../database/db.js";
dbInit()
const SECRET = process.env.JWT_SECRET;

 const login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Validate user credentials...
  
      if (!SECRET) {
        throw new Error('JWT_SECRET is not defined in your environment variables.');
      }
  
      const token = jwt.sign({ password }, SECRET, { expiresIn: '1h' });
  
      res.status(200).json({ token });
    } catch (error) {
      console.error('Error during login:', error.message);
      res.status(500).json({ message: error.message });
    }
  };

const register = async (req, res) => {
  console.log("Register function called with body:", req.body); // Debug log
  const { email, password, phone } = req.body;

  if (!email || !password || !phone) {
    console.log("Missing fields:", { email, password, phone });
    return res
      .status(400)
      .json({ message: "Please provide all required fields." });
  }

  try {
    const hashedPassword = await hash(password, 10);
    const db = getDb();
    await db.query(
      "INSERT INTO users (email, password, phone) VALUES (?, ?, ?)",
      [email, hashedPassword, phone]
    );
    console.log("User registered successfully");
    res.status(201).json({ message: "User registered successfully." });
  } catch (err) {
    console.error("Error registering user:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default { login, register };
