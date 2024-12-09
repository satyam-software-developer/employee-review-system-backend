// Import express, a web application framework for Node.js
const express = require("express");

// Create a new router instance to manage the application's routes
const router = express.Router();

// Route for user-related actions (public routes)
// This includes routes like sign-in, sign-up, etc. handled by the `user` router
router.use("/", require("./user"));

// Routes for admin dashboard
// This includes routes related to the admin dashboard (admin-specific functionality)
router.use("/dashboard/admin", require("./admin"));

// Routes for employee dashboard
// This includes routes related to the employee dashboard (employee-specific functionality)
router.use("/dashboard/employee", require("./employee"));

// Export the router to be used in the main app
// This makes the router accessible in the main app file (usually `app.js` or `server.js`)
module.exports = router;
