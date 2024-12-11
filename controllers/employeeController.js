// Importing required models
import User from "../models/User.js"; // User model for interacting with the users collection
import Feedback from "../models/feedback.js"; // Feedback model for interacting with the feedback collection

// Render the employee's dashboard
// Displays the reviews assigned and feedback received by the employee
export const employee = async (req, res) => {
  try {
    // Arrays to hold the reviews assigned to the employee and feedback received
    const employeeAssignedForReview = [];
    const feedbackByOther = [];

    // IDs of reviews assigned to the employee
    const idOfAssignReview = req.user.reviewAssigned;

    // IDs of feedback received by the employee
    const idOfFeedbacks = req.user.feedbackByOthers;

    // Fetch all employees assigned for reviews
    if (idOfAssignReview.length > 0) {
      for (const reviewId of idOfAssignReview) {
        // Find the employee by ID
        const employee = await User.findById(reviewId);
        if (employee) {
          // Add the employee to the list of assigned reviews
          employeeAssignedForReview.push(employee);
        }
      }
    }

    // Fetch all feedback received by the employee
    if (idOfFeedbacks.length > 0) {
      for (const feedbackId of idOfFeedbacks) {
        // Find feedback by ID and populate the reviewer field with the name
        const feedback = await Feedback.findById(feedbackId).populate(
          "reviewer", // Field to populate
          "name" // Select only the name field of the reviewer
        );
        if (feedback) {
          // Add the feedback to the list of feedback received
          feedbackByOther.push(feedback);
        }
      }
    }

    // Render the employee dashboard page with the required data
    res.render("employee", {
      title: "Employee | Dashboard", // Page title
      assignReviews: employeeAssignedForReview, // List of employees assigned for reviews
      feedbacks: feedbackByOther, // List of feedback received
    });
  } catch (error) {
    // Handle errors during rendering of the dashboard
    console.error("Error rendering employee dashboard:", error);
    req.flash("error", "An error occurred while loading the dashboard."); // Flash an error message
    res.redirect("back"); // Redirect to the referring page
  }
};

// Add feedback for an employee
export const addReview = async (req, res) => {
  try {
    // Get the recipient's ID from the query parameters
    const { id: recipient } = req.query;

    // Get the reviewer's ID from the logged-in user's session
    const { _id: reviewer } = req.user;

    // Get the comment from the request body
    const { comment } = req.body;

    // Create a new feedback entry in the database
    const feedback = await Feedback.create({
      comment, // Feedback comment
      reviewer, // Reviewer ID
      recipient, // Recipient ID
    });

    // Update the recipient's feedback list by adding the new feedback
    const recipientEmployee = await User.findById(recipient); // Find the recipient user
    if (recipientEmployee) {
      recipientEmployee.feedbackByOthers.push(feedback._id); // Add the feedback ID to the recipient's feedback list
      await recipientEmployee.save(); // Save the updated recipient data
    }

    // Update the reviewer's assigned reviews list to remove the completed review
    const reviewerEmployee = await User.findById(reviewer); // Find the reviewer user
    if (reviewerEmployee) {
      // Filter out the recipient from the reviewAssigned list
      reviewerEmployee.reviewAssigned = reviewerEmployee.reviewAssigned.filter(
        (review) => review.toString() !== recipient.toString()
      );
      await reviewerEmployee.save(); // Save the updated reviewer data
    }

    // Flash a success message and redirect back to the referring page
    req.flash("success", "Your feedback has been added successfully!");
    res.redirect(req.get("Referrer") || "/");
  } catch (error) {
    // Handle errors during feedback addition
    console.error("Error adding feedback:", error);
    req.flash("error", "An error occurred while adding feedback."); // Flash an error message
    res.redirect("back"); // Redirect to the referring page
  }
};
