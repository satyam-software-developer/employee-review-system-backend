// Import express module to work with routes and HTTP requests
const express = require("express");

// Create a new router instance using express.Router() for handling route definitions
const router = express.Router();

// Import passport for handling user authentication
const passport = require("passport");

// Import the controller that contains logic for handling user-related actions
const userController = require("../controllers/userController");

// Route to render the homepage or the sign-in page
// This route is accessed by GET requests to '/'
router.get("/", userController.home);

// Route to render the sign-up page
// This route is accessed by GET requests to '/sign-up'
router.get("/sign-up", userController.signUp);

// Route for signing out the user
// This route is accessed by GET requests to '/signout'
// It calls the signout function in the userController, which handles logging out the user and destroying the session
router.get("/signout", userController.signout);

// Route for signing in a user and creating a session
// This route is accessed by POST requests to '/create-session'
// It uses passport's local authentication strategy to authenticate the user
// If authentication fails, it redirects to the homepage
// If authentication is successful, it creates a session and calls userController.createSession
router.post(
  "/create-session",
  passport.authenticate("local", { failureRedirect: "/" }), // Use passport's local strategy to authenticate the user
  userController.createSession // Handle the session creation and redirection on success
);

// Route for creating a new user account
// This route is accessed by POST requests to '/create-account'
// It calls the createAccount function from the userController to handle account creation
router.post("/create-account", userController.createAccount);

// Export the router for use in the main app file
// This makes the user-related routes available for use by the application
module.exports = router;
