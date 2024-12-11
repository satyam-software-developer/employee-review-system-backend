// Import express, a web application framework for Node.js
import express from "express";

// Import passport, an authentication middleware for securing routes
import passport from "passport";

// Import the employee controller, which contains the logic for handling employee-specific operations
import * as employeeController from "../controllers/employeeController.js";

// Create a new router instance for handling employee-related routes
const router = express.Router();

// Middleware util for checking authentication and employee access
const authenticateEmployee = [
  passport.checkAuthentication, // Middleware to verify if the user is logged in
  passport.isEmployee, // Middleware to verify if the logged-in user is an employee
];

// Route: Render the employee dashboard
// Path: GET `/`
// Middleware: `authenticateEmployee` ensures the user is logged in and has the employee role
// Controller: `employeeController.employee` handles rendering the dashboard with assigned reviews and received feedback
router.get("/", authenticateEmployee, employeeController.employee);

// Route: Add feedback (review) for another employee
// Path: POST `/addReview`
// Middleware: `authenticateEmployee` ensures the user is logged in and has the employee role
// Controller: `employeeController.addReview` handles creating and saving feedback for a fellow employee
router.post("/addReview", authenticateEmployee, employeeController.addReview);

// Export the router so it can be included in the main application
export default router;
