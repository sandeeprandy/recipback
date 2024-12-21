import { getDb, dbInit } from "../database/db.js";
dbInit();

const addPost = async (req, res) => {
  console.log("addRecord function called with body:", req.body); // Debug log

  const { ilaakaName, pinCode, description, image } = req.body;

  // Validation for required fields
  if (!ilaakaName || !pinCode || !description || !image) {
    console.log("Missing fields:", { ilaakaName, pinCode, description, image });
    return res
      .status(400)
      .json({ message: "Please provide all required fields." });
  }

  try {
    const tableName = `s${pinCode}s`; // Format table name as per the requirement
    const db = getDb(); // Get database connection

    // Create table if it doesn't exist
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS ${tableName} (
          id INT AUTO_INCREMENT PRIMARY KEY,
          ilaakaName VARCHAR(255) NOT NULL,
          description TEXT NOT NULL,
          image TEXT NOT NULL,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;
    await db.query(createTableQuery);
    console.log(`Table '${tableName}' ensured to exist.`);

    // Insert data into the table
    const insertDataQuery = `
        INSERT INTO ${tableName} (ilaakaName, description, image)
        VALUES (?, ?, ?)
      `;
    await db.query(insertDataQuery, [ilaakaName, description, image]);
    console.log("Data inserted successfully into table:", tableName);

    res.status(201).json({ message: "Data inserted successfully." });
  } catch (err) {
    console.error("Error in addRecord:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default { addPost };
