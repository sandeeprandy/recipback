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

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    if (!SECRET) {
      throw new Error(
        "JWT_SECRET is not defined in your environment variables."
      );
    }

    // Fetch user data from the database
    const users = await db.query(
      `SELECT password, first_name, pin_code, created_at, email, phone_number ,last_name, ilaaka 
       FROM users 
       WHERE email = ?`,
      [email]
    );
    const usersData = await db.query(
      `SELECT  first_name, pin_code, created_at, email, phone_number, ilaaka ,last_name
       FROM users 
       WHERE email = ?`,
      [email]
    );
    // Check if user exists
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    // Retrieve the first user object from the array
    const user = users[0];
    console
    console.log(user.password);

    // Check if the retrieved password is valid
  

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await compare(password, user[0].password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Generate a token after successful password verification
    const token = jwt.sign({ email: user.email }, SECRET, { expiresIn: "1h" });

    // Exclude the password field from the response
    

    res.status(200).json({ token, user:  usersData });
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
