// Import express, a web application framework for Node.js
import express from "express";

// Import passport, an authentication middleware
import passport from "passport";

// Import the admin controller, which contains the logic for handling admin-specific operations
import * as adminController from "../controllers/adminController.js";

// Create a new router instance for handling admin-related routes
const router = express.Router();

// Middleware util for checking authentication and admin access
const authenticate = [
  passport.checkAuthentication, // Middleware to verify if the user is logged in
  passport.isAdmin, // Middleware to verify if the logged-in user has admin privileges
];

// Admin Routes

// Route: Render the admin dashboard
// Path: GET `/`
// Middleware: `authenticate` ensures the user is logged in and an admin
// Controller: `adminController.admin` handles rendering the dashboard
router.get("/", authenticate, adminController.admin);

// Route: Delete an employee
// Path: GET `/delete`
// Middleware: `authenticate` ensures the user is logged in and an admin
// Controller: `adminController.deleteEmployee` handles employee deletion
router.get("/delete", authenticate, adminController.deleteEmployee);

// Route: Render the update form for an employee
// Path: GET `/updateForm`
// Middleware: `authenticate` ensures the user is logged in and an admin
// Controller: `adminController.updateForm` provides the form for updating employee details
router.get("/updateForm", authenticate, adminController.updateForm);

// Route: Update an employee's data
// Path: POST `/update`
// Middleware: `authenticate` ensures the user is logged in and an admin
// Controller: `adminController.updateEmployee` handles updating the employee's data
router.post("/update", authenticate, adminController.updateEmployee);

// Route: Render the add employee form
// Path: GET `/addEmployee`
// Middleware: `authenticate` ensures the user is logged in and an admin
// Controller: `adminController.addEmployeeForm` provides the form to add a new employee
router.get("/addEmployee", authenticate, adminController.addEmployeeForm);

// Route: Create a new employee
// Path: POST `/createEmployee`
// Middleware: `authenticate` ensures the user is logged in and an admin
// Controller: `adminController.addEmployee` handles adding a new employee to the system
router.post("/createEmployee", authenticate, adminController.addEmployee);

// Route: Assign a review to an employee
// Path: POST `/assignReview`
// Middleware: `authenticate` ensures the user is logged in and an admin
// Controller: `adminController.assignReview` handles assigning a review to a specific employee
router.post("/assignReview", authenticate, adminController.assignReview);

// Route: Render the update form for an admin
// Path: GET `/updateAdminForm`
// Middleware: `authenticate` ensures the user is logged in and an admin
// Controller: `adminController.updateAdminForm` provides the form for updating admin details
router.get("/updateAdminForm", authenticate, adminController.updateAdminForm);

// Route: Update admin data
// Path: POST `/updateAdmin`
// Middleware: `authenticate` ensures the user is logged in and an admin
// Controller: `adminController.updateAdmin` handles updating the admin's data
router.post("/updateAdmin", authenticate, adminController.updateAdmin);

// Export the router so it can be used in the main application
export default router;
