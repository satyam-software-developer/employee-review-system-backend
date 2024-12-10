// Import the mongoose library for interacting with MongoDB
const mongoose = require("mongoose");

// Extract the MongoDB URL from environment variables
const { MONGODB_URL } = process.env;

// Export a function to establish a connection to the MongoDB database
exports.connect = () => {
  /**
   * Use mongoose's `connect` method to establish a connection to the MongoDB database.
   * `MONGODB_URL` is obtained from environment variables to keep credentials secure.
   *
   * Note: Ensure your `.env` file contains a valid MONGODB_URL for connecting to the database.
   */
  mongoose
    .connect(MONGODB_URL, {
      useNewUrlParser: true, // Use the new URL string parser
      useUnifiedTopology: true, // Use the new server discovery and monitoring engine
    })
    .then(() => {
      // Log a success message when the connection is successfully established
      console.log("✅ Database is connected successfully");
    })
    .catch((error) => {
      // Log an error message if the connection fails
      console.error("❌ Database connection failed");
      console.error("Error:", error.message);
      process.exit(1); // Exit the process with a failure code
    });
};
