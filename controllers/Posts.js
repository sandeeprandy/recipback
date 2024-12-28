import { getDb, dbInit } from "../database/db.js";
dbInit();

const addPost = async (req, res) => {
  console.log("addRecord function called with body:", req.body); // Debug log

  const { ilaakaName, pinCode, description, image, firstName, lastName } = req.body;

  // Validation for required fields
  if (!ilaakaName || !pinCode || !description || !image || !firstName || !lastName) {
    console.log("Missing fields:", {
      ilaakaName,
      pinCode,
      description,
      image,
      firstName,
      lastName,
    });
    return res.status(400).json({ message: "Please provide all required fields." });
  }

  try {
    const db = getDb(); // Get database connection

    // Insert data into the table
    const insertDataQuery = `
        INSERT INTO posts (ilaakaName, pinCode, description, image, first_name, last_name)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
    await db.query(insertDataQuery, [ilaakaName, pinCode, description, image, firstName, lastName]);
    console.log("Data inserted successfully.");

    res.status(201).json({ message: "Data inserted successfully." });
  } catch (err) {
    console.error("Error in addRecord:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getPosts = async (req, res) => {
  console.log("getPosts function called with query:", req.query); // Debug log

  const { ilaakaName, pinCode } = req.query; // Extract query parameters

  try {
    const db = getDb(); // Get database connection

    // Base query
    let getPostsQuery = `SELECT * FROM posts`;
    const queryParams = [];

    // Add conditions based on prioritization
    if (pinCode) {
      getPostsQuery += ` WHERE pinCode = ?`;
      queryParams.push(pinCode);

      // Further filter by ilaakaName if provided
      if (ilaakaName) {
        getPostsQuery += ` AND ilaakaName = ?`;
        queryParams.push(ilaakaName);
      }
    } else if (ilaakaName) {
      // If no pinCode, filter by ilaakaName only
      getPostsQuery += ` WHERE ilaakaName = ?`;
      queryParams.push(ilaakaName);
    }

    console.log("Executing query:", getPostsQuery, "with params:", queryParams);
    const [posts] = await db.query(getPostsQuery, queryParams); // Ensure correct query execution

    res.status(200).json({ posts });
  } catch (err) {
    console.error("Error in getPosts:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default { addPost, getPosts };
