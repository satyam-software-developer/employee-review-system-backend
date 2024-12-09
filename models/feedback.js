// Import mongoose, a library for interacting with MongoDB
const mongoose = require("mongoose");

// Define the schema for the Feedback model
const feedbackSchema = new mongoose.Schema(
  {
    // The comment provided by the reviewer about the recipient
    comment: {
      type: String, // The type of this field is a string
      required: [true, "Comment is required"], // This field is mandatory, with a custom error message
      trim: true, // Automatically removes leading and trailing whitespace from the string
      minlength: [3, "Comment must be at least 3 characters"], // Ensures the comment has a minimum length of 3 characters
    },
    // The ID of the user who is giving the feedback
    reviewer: {
      type: mongoose.Schema.Types.ObjectId, // This field is a MongoDB ObjectId
      ref: "User", // References the "User" model for relational data
      required: [true, "Reviewer ID is required"], // This field is mandatory, with a custom error message
    },
    // The ID of the user who is receiving the feedback
    recipient: {
      type: mongoose.Schema.Types.ObjectId, // This field is also a MongoDB ObjectId
      ref: "User", // References the "User" model for relational data
      required: [true, "Recipient ID is required"], // This field is mandatory, with a custom error message
    },
  },
  {
    // Enables automatic creation of `createdAt` and `updatedAt` timestamps
    timestamps: true,
  }
);

// Create a compound index to ensure unique feedback for each reviewer-recipient pair
feedbackSchema.index({ reviewer: 1, recipient: 1 }, { unique: true });
// This ensures that a reviewer cannot leave more than one feedback for the same recipient.

// Compile the Feedback model only if it hasn't already been compiled
// This prevents errors when the model is imported multiple times in a project
const Feedback =
  mongoose.models.Feedback || mongoose.model("Feedback", feedbackSchema);

// Export the Feedback model to make it accessible in other parts of the application
module.exports = Feedback;
