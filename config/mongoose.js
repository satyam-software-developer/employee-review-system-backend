// Import the mongoose library for interacting with MongoDB
const mongoose = require("mongoose");

// Define the connection string for the MongoDB database
// Replace with your actual MongoDB URI and credentials as needed
const MONGODB_URL =
  "mongodb+srv://krsatyam0506:ghhloYAlLIwqyZ5H@cluster0.iw1gp.mongodb.net/";

// Export a function to establish a connection to the MongoDB database
exports.connect = () => {
  /**
   * Use mongoose's `connect` method to establish a connection to the MongoDB database.
   * `MONGODB_URL` is the connection string that contains:
   * - Protocol: `mongodb+srv` (for connecting to a MongoDB Atlas cluster)
   * - Username: `krsatyam0506`
   * - Password: `ghhloYAlLIwqyZ5H`
   * - Cluster: `cluster0.iw1gp.mongodb.net/`
   *
   * Note: Make sure sensitive credentials like the username and password are securely stored
   * using environment variables to avoid exposing them in the source code.
   */
  mongoose
    .connect(MONGODB_URL) // Attempt to connect to the database
    .then(() => {
      // Log a success message if the connection is established
      console.log("✅ Database connected successfully");
    })
    .catch((err) => {
      // Log an error message if the connection fails
      console.error("❌ Database connection error:", err.message);
    });
};
