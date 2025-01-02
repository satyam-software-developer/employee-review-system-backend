// Import the mongoose library for interacting with MongoDB
import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables from the .env file
dotenv.config();

// Define the connection string for the MongoDB database using environment variables
const MONGODB_URL = process.env.MONGODB_URL;

if (!MONGODB_URL) {
  throw new Error(
    "❌ MONGODB_URL is not defined in the environment variables."
  );
}

// Export a function to establish a connection to the MongoDB database
const connect = () => {
  /**
   * Use mongoose's `connect` method to establish a connection to the MongoDB database.
   * `MONGODB_URL` is the connection string loaded from environment variables.
   *
   * Note: Ensure the .env file contains the MONGODB_URL variable with the correct format and credentials.
   */
  mongoose
    .connect(MONGODB_URL)
    .then(() => {
      console.log("✅ Database connected successfully");
    })
    .catch((err) => {
      console.error("❌ Database connection error:", err.message);
    });
};

export default connect;
