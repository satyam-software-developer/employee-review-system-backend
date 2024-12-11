// Import express, a web application framework for Node.js
import express from "express";

// Import routers for different functionalities
import userRoutes from "./user.js";
import adminRoutes from "./admin.js";
import employeeRoutes from "./employee.js";

// Create a new router instance to manage the application's routes
const router = express.Router();

// Route for user-related actions (public routes)
// This includes routes like sign-in, sign-up, etc. handled by the `user` router
router.use("/", userRoutes);

// Routes for admin dashboard
// This includes routes related to the admin dashboard (admin-specific functionality)
router.use("/dashboard/admin", adminRoutes);

// Routes for employee dashboard
// This includes routes related to the employee dashboard (employee-specific functionality)
router.use("/dashboard/employee", employeeRoutes);

// Export the router to be used in the main app
// This makes the router accessible in the main app file (usually `app.js` or `server.js`)
export default router;
