// Import required modules
import User from "../models/User.js"; // User model for interacting with the users collection
import Feedback from "../models/feedback.js"; // Feedback model for interacting with the feedback collection
import bcrypt from "bcryptjs"; // For hashing and comparing passwords

// Render the admin dashboard
export const admin = async (req, res) => {
  try {
    // Fetch all users with the roles "Admin" and "Employee"
    const admins = await User.find({ role: "Admin" });
    const employees = await User.find({ role: "Employee" });

    // Combine admins and employees into a single array
    const allUsers = [...admins, ...employees];

    // Render the admin dashboard view and pass the lists
    res.render("admin", {
      title: "Admin | Dashboard", // Page title
      allUsers, // Combined list of admins and employees
      admins, // List of admins
      employees, // List of employees
    });
  } catch (error) {
    console.error("Error rendering admin dashboard:", error);
    req.flash("error", "Failed to load dashboard.");
    return res.redirect("/");
  }
};

// Delete an employee and related feedback
export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.query; // Get the employee ID from the query parameters

    await Promise.all([
      Feedback.deleteMany({
        $or: [{ reviewer: id }, { recipient: id }], // Delete all feedback linked to the employee
      }),
      User.findByIdAndDelete(id), // Delete the employee record
    ]);

    req.flash("success", "Employee successfully deleted");
    res.redirect(req.get("Referrer") || "/");
  } catch (error) {
    console.error("Error deleting employee:", error);
    req.flash("error", "Failed to delete employee.");
    res.redirect(req.get("Referrer") || "/");
  }
};

// Render the form to update employee data
export const updateForm = async (req, res) => {
  try {
    const { id } = req.query;

    const employee = await User.findById(id);
    if (!employee) {
      req.flash("error", "Employee not found.");
      return res.redirect("/dashboard/admin");
    }

    const feedbackByOther = await Promise.all(
      employee.feedbackByOthers.map(async (feedbackId) =>
        Feedback.findById(feedbackId).populate("reviewer", "name")
      )
    );

    res.render("updateForm", {
      title: "Admin | Update Employee",
      employee,
      feedbacks: feedbackByOther.filter((feedback) => feedback),
    });
  } catch (error) {
    console.error("Error rendering update form:", error);
    req.flash("error", "Failed to load update form.");
    res.redirect("/dashboard/admin");
  }
};

// Update employee data
export const updateEmployee = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.query.id, req.body);

    req.flash("success", "Employee information updated.");
    res.redirect("/dashboard/admin");
  } catch (error) {
    console.error("Error updating employee:", error);
    req.flash("error", "Failed to update employee.");
    res.redirect("/dashboard/admin");
  }
};

// Render the form for adding a new employee
export const addEmployeeForm = (req, res) => {
  res.render("addEmployee", {
    title: "Admin | Add Employee",
  });
};

// Add a new employee
export const addEmployee = async (req, res) => {
  try {
    const { name, email, password, cnf_password } = req.body;

    const userExist = await User.findOne({ email });
    if (userExist) {
      req.flash("error", "Email address already exists.");
      return res.redirect(req.get("Referrer") || "/");
    }

    if (password !== cnf_password) {
      req.flash("error", "Passwords do not match.");
      return res.redirect(req.get("Referrer") || "/");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      role: "Employee",
      password: hashedPassword,
    });

    req.flash("success", "New employee added successfully.");
    res.redirect("/dashboard/admin");
  } catch (error) {
    console.error("Error adding new employee:", error);
    req.flash("error", "Failed to add employee.");
    res.redirect("/dashboard/admin");
  }
};

// Render the form to update admin data
export const updateAdminForm = async (req, res) => {
  try {
    const { id } = req.query;

    const admin = await User.findById(id);
    if (!admin || admin.role !== "Admin") {
      req.flash("error", "Admin not found.");
      return res.redirect("/dashboard/admin");
    }

    res.render("updateAdminForm", {
      title: "Admin | Update Admin",
      admin,
    });
  } catch (error) {
    console.error("Error rendering update admin form:", error);
    req.flash("error", "Failed to load update form.");
    res.redirect("/dashboard/admin");
  }
};

// Update admin data
export const updateAdmin = async (req, res) => {
  try {
    const { id } = req.query;
    const { name, email } = req.body;

    await User.findByIdAndUpdate(id, { name, email });

    req.flash("success", "Admin information updated.");
    res.redirect("/dashboard/admin");
  } catch (error) {
    console.error("Error updating admin:", error);
    req.flash("error", "Failed to update admin.");
    res.redirect("/dashboard/admin");
  }
};

// Assign a review to an employee
export const assignReview = async (req, res) => {
  try {
    const { id } = req.query;
    const { recipient } = req.body;

    const employee = await User.findById(id);

    if (employee.reviewAssigned.includes(recipient)) {
      req.flash("error", "Recipient already assigned to this user.");
      return res.redirect(req.get("Referrer") || "/");
    }

    employee.reviewAssigned.push(recipient);
    await employee.save();

    req.flash("success", "Review assigned successfully.");
    res.redirect(req.get("Referrer") || "/");
  } catch (error) {
    console.error("Error assigning review:", error);
    req.flash("error", "Failed to assign review.");
    res.redirect(req.get("Referrer") || "/");
  }
};
