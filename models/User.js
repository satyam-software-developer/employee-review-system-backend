// Import mongoose, a library used for MongoDB interaction
import mongoose from "mongoose";

// Define the schema for the User model
const userSchema = new mongoose.Schema(
  {
    // Field for the user's name
    name: {
      type: String, // Data type: String
      required: [true, "Name is required"], // Field is mandatory, with a custom error message
      trim: true, // Automatically removes leading and trailing whitespace
      minlength: [2, "Name must be at least 2 characters long"], // Minimum length validation for the name
    },
    // Field for the user's email address
    email: {
      type: String, // Data type: String
      required: [true, "Email is required"], // Field is mandatory, with a custom error message
      unique: true, // Ensures each email is unique in the database
      trim: true, // Removes whitespace from both ends
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Regular expression for validating email format
        "Please provide a valid email address", // Custom error message for invalid email format
      ],
    },
    // Field for the user's password
    password: {
      type: String, // Data type: String
      required: [true, "Password is required"], // Field is mandatory, with a custom error message
      minlength: [6, "Password must be at least 6 characters long"], // Minimum length validation for password
    },
    // Field for the user's role (Admin or Employee)
    role: {
      type: String, // Data type: String
      required: [true, "Role is required"], // Field is mandatory, with a custom error message
      enum: {
        values: ["Admin", "Employee"], // Allowed values: 'Admin' or 'Employee'
        message: "Role must be either Admin or Employee", // Custom error message for invalid role
      },
    },
    // Array field for reviews assigned to this user by an admin
    reviewAssigned: [
      {
        type: mongoose.Schema.Types.ObjectId, // Each item is a MongoDB ObjectId
        ref: "User", // References another user (who is assigned as a reviewer)
      },
    ],
    // Array field for feedbacks received by this user from other employees
    feedbackByOthers: [
      {
        type: mongoose.Schema.Types.ObjectId, // Each item is a MongoDB ObjectId
        ref: "Feedback", // References the Feedback model
      },
    ],
  },
  {
    // Enable timestamps to automatically track creation and modification times
    timestamps: true,
  }
);

// Indexes

// Create a unique index on the email field to prevent duplicate emails
userSchema.index({ email: 1 }, { unique: true });

// Reuse the User model if it has already been compiled
// This prevents re-compilation errors when the model is imported multiple times in the application
const User = mongoose.models.User || mongoose.model("User", userSchema);

// Export the User model so it can be used in other parts of the application
export default User;
