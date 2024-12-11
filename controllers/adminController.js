// Import required modules
import User from "../models/User.js"; // User model for interacting with the users collection
import Feedback from "../models/feedback.js"; // Feedback model for interacting with the feedback collection
import bcrypt from "bcryptjs"; // For hashing and comparing passwords

// Render the admin dashboard
export const admin = async (req, res) => {
  try {
    // Fetch all users with the role "Employee" from the database
    const employeeList = await User.find({ role: "Employee" });

    // Render the admin dashboard view and pass the employee list
    res.render("admin", {
      title: "Admin | Dashboard", // Page title
      employees: employeeList, // List of employees
    });
  } catch (error) {
    // Handle errors during dashboard rendering
    console.error("Error rendering admin dashboard:", error);
    req.flash("error", "Failed to load dashboard."); // Flash an error message
    return res.redirect("/"); // Redirect to the home page
  }
};

// Delete an employee and related feedback
export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.query; // Get the employee ID from the query parameters

    // Execute multiple asynchronous operations concurrently
    await Promise.all([
      // Delete all feedback records where the employee is either the reviewer or the recipient
      Feedback.deleteMany({
        $or: [
          { reviewer: id }, // Condition: The employee is the reviewer in the feedback
          { recipient: id }, // Condition: The employee is the recipient in the feedback
        ],
      }),

      // Delete the employee record from the database using their unique ID
      User.findByIdAndDelete(id),
    ]);

    // Flash a success message and redirect to the referring page or home page
    req.flash("success", "Employee successfully deleted");
    res.redirect(req.get("Referrer") || "/");
  } catch (error) {
    // Handle errors during employee deletion
    console.error("Error deleting employee:", error);
    req.flash("error", "Failed to delete employee."); // Flash an error message
    res.redirect(req.get("Referrer") || "/");
  }
};

// Render the form to update employee data
export const updateForm = async (req, res) => {
  try {
    const { id } = req.query; // Get the employee ID from the query parameters

    // Fetch the employee data from the database
    const employee = await User.findById(id);
    if (!employee) {
      req.flash("error", "Employee not found."); // Flash an error message
      return res.redirect("/dashboard/admin"); // Redirect to the admin dashboard
    }

    // Fetch feedback given to the employee and populate the reviewer's name
    const feedbackByOther = await Promise.all(
      employee.feedbackByOthers.map(async (feedbackId) =>
        Feedback.findById(feedbackId).populate("reviewer", "name")
      )
    );

    // Render the update form view and pass the employee and feedback data
    res.render("updateForm", {
      title: "Admin | Update Employee", // Page title
      employee, // Employee data
      feedbacks: feedbackByOther.filter((feedback) => feedback), // Remove null values from the feedback list
    });
  } catch (error) {
    // Handle errors during update form rendering
    console.error("Error rendering update form:", error);
    req.flash("error", "Failed to load update form."); // Flash an error message
    res.redirect("/dashboard/admin"); // Redirect to the admin dashboard
  }
};

// Update employee data
export const updateEmployee = async (req, res) => {
  try {
    // Update the employee's data in the database
    await User.findByIdAndUpdate(req.query.id, req.body);

    // Flash a success message and redirect to the admin dashboard
    req.flash("success", "Employee information updated.");
    res.redirect("/dashboard/admin");
  } catch (error) {
    // Handle errors during employee update
    console.error("Error updating employee:", error);
    req.flash("error", "Failed to update employee."); // Flash an error message
    res.redirect("/dashboard/admin");
  }
};

// Render the form for adding a new employee
export const addEmployeeForm = (req, res) => {
  // Render the add employee form view
  res.render("addEmployee", {
    title: "Admin | Add Employee", // Page title
  });
};

// Add a new employee
export const addEmployee = async (req, res) => {
  try {
    const { name, email, password, cnf_password } = req.body; // Get form data

    // Check if a user with the same email already exists
    const userExist = await User.findOne({ email });
    if (userExist) {
      req.flash("error", "Email address already exists."); // Flash an error message
      return res.redirect(req.get("Referrer") || "/");
    }

    // Ensure the passwords match
    if (password !== cnf_password) {
      req.flash("error", "Passwords do not match."); // Flash an error message
      return res.redirect(req.get("Referrer") || "/");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new employee in the database
    await User.create({
      name,
      email,
      role: "Employee", // Set the role to "Employee"
      password: hashedPassword, // Save the hashed password
    });

    // Flash a success message and redirect to the admin dashboard
    req.flash("success", "New employee added successfully.");
    res.redirect("/dashboard/admin");
  } catch (error) {
    // Handle errors during employee addition
    console.error("Error adding new employee:", error);
    req.flash("error", "Failed to add employee."); // Flash an error message
    res.redirect("/dashboard/admin");
  }
};

// Assign a review to an employee
export const assignReview = async (req, res) => {
  try {
    const { id } = req.query; // Get the reviewer's ID from the query parameters
    const { recipient } = req.body; // Get the recipient's ID from the form data

    // Fetch the employee (reviewer) from the database
    const employee = await User.findById(id);

    // Check if the recipient is already assigned to this employee
    if (employee.reviewAssigned.includes(recipient)) {
      req.flash("error", "Recipient already assigned to this user."); // Flash an error message
      return res.redirect(req.get("Referrer") || "/");
    }

    // Assign the recipient to the employee's reviewAssigned list
    employee.reviewAssigned.push(recipient);
    await employee.save(); // Save the changes to the database

    // Flash a success message and redirect to the referring page or home page
    req.flash("success", "Review assigned successfully.");
    res.redirect(req.get("Referrer") || "/");
  } catch (error) {
    // Handle errors during review assignment
    console.error("Error assigning review:", error);
    req.flash("error", "Failed to assign review."); // Flash an error message
    res.redirect(req.get("Referrer") || "/");
  }
};
