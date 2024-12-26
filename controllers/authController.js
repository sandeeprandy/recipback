import { compare, hash } from "bcrypt";
import jwt from "jsonwebtoken"; // Import as default export
const { sign } = jwt; // Destructure the required function

import { getDb, dbInit } from "../database/db.js";
dbInit();
const SECRET = process.env.JWT_SECRET;

const login = async (req, res) => {
  const db = getDb();
  try {
    const { email, password } = req.body;

    // Validate user credentials...

    if (!SECRET) {
      throw new Error(
        "JWT_SECRET is not defined in your environment variables."
      );
    }
    const [user] = await db.query(
      `SELECT  first_name ,pin_code , created_at, email , phone_number , ilaaka FROM users WHERE email = ?`,
      [email]
    );

    console.log(user);

    const token = jwt.sign({ password }, SECRET, { expiresIn: "1h" });
    if (token) {
      res.status(200).json({ token, user });
    }else {
      res.err("password is incorrect")
    }

    
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ message: error.message });
  }
};

const register = async (req, res) => {
  // Destructure fields from the request body
  const { email, password, phoneNumber, firstName, lastName, ilaaka, pinCode } =
    req.body;

  // Check for missing required fields
  if (
    !email ||
    !password ||
    !phoneNumber ||
    !firstName ||
    !lastName ||
    !ilaaka ||
    !pinCode
  ) {
    console.log("Missing fields:", {
      email,
      password,
      phoneNumber,
      firstName,
      lastName,
      ilaaka,
      pinCode,
    });
    return res
      .status(400)
      .json({ message: "Please provide all required fields." });
  }

  try {
    const hashedPassword = await hash(password, 10); // Hash the password securely
    const db = getDb();

    // Insert the user data into the database
    await db.query(
      `INSERT INTO users 
         (email, password, phone_number, first_name, last_name, ilaaka, pin_code) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [email, hashedPassword, phoneNumber, firstName, lastName, ilaaka, pinCode]
    );

    console.log("User registered successfully");
    res.status(201).json({ message: "User registered successfully." });
  } catch (err) {
    console.error("Error registering user:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default { login, register };
