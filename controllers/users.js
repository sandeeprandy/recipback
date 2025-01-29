import { getDb } from "../database/db.js";

const feed = async (req, res) => {
  console.log("getPosts function called");

  try {
    const tableName = "s503225s"; // Specify the table name
    const db = getDb(); // Get database connection

    // Query to fetch data from the table
    const query = `SELECT id, ilaakaName, description, image, createdAt FROM ${tableName}`;
    const results = await db.query(query);

    // Check if the 'image' field is a Buffer and convert it to a string (Base64)
    const formattedResults = results.map(record => {
      if (Buffer.isBuffer(record.image)) {
        // If image is a Buffer, convert it to a Base64 string
        record.image = record.image.toString('base64');
      }
      return record;
    });

    console.log(`Data fetched successfully from table: ${tableName}`);

    // Send the data to the frontend
    res.status(200).json(formattedResults);
  } catch (err) {
    console.error("Error in getPosts:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};



export default { feed };
