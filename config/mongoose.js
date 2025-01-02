// // Import the mongoose library for interacting with MongoDB
// import mongoose from "mongoose";

// // Define the connection string for the MongoDB database
// // Replace with your actual MongoDB URI and credentials as needed
// const MONGODB_URL =
//   "mongodb+srv://krsatyam0506:ghhloYAlLIwqyZ5H@cluster0.iw1gp.mongodb.net/";

// // Export a function to establish a connection to the MongoDB database
// const connect = () => {
//   /**
//    * Use mongoose's `connect` method to establish a connection to the MongoDB database.
//    * `MONGODB_URL` is the connection string that contains:
//    * - Protocol: `mongodb+srv` (for connecting to a MongoDB Atlas cluster)
//    * - Username: `krsatyam0506`
//    * - Password: `ghhloYAlLIwqyZ5H`
//    * - Cluster: `cluster0.iw1gp.mongodb.net/`
//    *
//    * Note: Make sure sensitive credentials like the username and password are securely stored
//    * using environment variables to avoid exposing them in the source code.
//    */
//   mongoose
//     .connect(MONGODB_URL)
//     .then(() => {
//       console.log("✅ Database connected successfully");
//     })
//     .catch((err) => {
//       console.error("❌ Database connection error:", err.message);
//     });
// };

// export default connect;



// Import the mongoose library for interacting with MongoDB
import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables from the .env file
dotenv.config();

// Define the connection string for the MongoDB database using environment variables
const MONGODB_URL = process.env.MONGODB_URL;

if (!MONGODB_URL) {
  throw new Error("❌ MONGODB_URL is not defined in the environment variables.");
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
