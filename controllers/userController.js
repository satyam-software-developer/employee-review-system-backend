// Importing necessary modules
const User = require("../models/User"); // User model for interacting with the users collection in the database
const bcrypt = require("bcryptjs"); // Library for hashing passwords securely

// Render the homepage or login page
module.exports.home = (req, res) => {
  try {
    // If the user is already logged in, redirect to their respective dashboard
    if (req.isAuthenticated()) {
      const user = req.user; // Get the authenticated user from the session
      return user.role === "Admin" // Check the user's role
        ? res.redirect("/dashboard/admin") // Redirect to admin dashboard
        : res.redirect("/dashboard/employee"); // Redirect to employee dashboard
    }

    // If the user is not logged in, render the sign-in page
    return res.render("signIn", {
      title: "Sign In", // Title for the sign-in page
    });
  } catch (error) {
    // Handle errors during rendering of the home page
    console.error("Error rendering home page:", error);
    req.flash("error", "An error occurred while loading the page."); // Flash an error message
    res.redirect("back"); // Redirect to the referring page
  }
};

// Render the signup page
module.exports.signUp = (req, res) => {
  try {
    // If the user is already logged in, redirect to their respective dashboard
    if (req.isAuthenticated()) {
      const user = req.user; // Get the authenticated user from the session
      return user.role === "Admin" // Check the user's role
        ? res.redirect("/dashboard/admin") // Redirect to admin dashboard
        : res.redirect("/dashboard/employee"); // Redirect to employee dashboard
    }

    // If not logged in, render the signup page
    return res.render("signUp", {
      title: "Sign Up", // Title for the signup page
    });
  } catch (error) {
    // Handle errors during rendering of the signup page
    console.error("Error rendering signup page:", error);
    req.flash("error", "An error occurred while loading the page."); // Flash an error message
    res.redirect("back"); // Redirect to the referring page
  }
};

// Create a new user account
module.exports.createAccount = async (req, res) => {
  try {
    // Extract user data from the request body
    let { name, email, password, cnf_password, role } = req.body;

    // Normalize email to lowercase to avoid case-sensitive issues
    email = email.toLowerCase();

    // Check if a user with the given email already exists in the database
    const userExist = await User.findOne({ email });
    if (userExist) {
      req.flash("error", "User already exists"); // Flash an error message
      return res.redirect("/"); // Redirect to the home page
    }

    // Validate that the password and confirm password fields match
    if (password !== cnf_password) {
      req.flash("error", "Passwords do not match"); // Flash an error message
      return res.redirect("back"); // Redirect to the referring page
    }

    // Encrypt the password for secure storage
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user document in the database
    await User.create({
      name, // User's name
      email, // User's email
      role, // User's role (e.g., Admin or Employee)
      password: hashedPassword, // Hashed password
    });

    // Flash a success message and redirect to the login page
    req.flash("success", "Account created successfully! Please log in.");
    return res.status(201).redirect("/"); // Redirect to the home page
  } catch (error) {
    // Handle errors during account creation
    console.error("Error creating account:", error);
    req.flash("error", "An error occurred while creating the account."); // Flash an error message
    res.redirect("back"); // Redirect to the referring page
  }
};

// Create a session for the user
module.exports.createSession = (req, res) => {
  try {
    const user = req.user; // Get the authenticated user from the session

    // Flash a success message indicating successful login
    req.flash("success", "Welcome, you are logged in!");

    // Redirect to the appropriate dashboard based on the user's role
    return user.role === "Admin" // Check the user's role
      ? res.redirect("/dashboard/admin") // Redirect to admin dashboard
      : res.redirect("/dashboard/employee"); // Redirect to employee dashboard
  } catch (error) {
    // Handle errors during session creation
    console.error("Error creating session:", error);
    req.flash("error", "An error occurred while logging in."); // Flash an error message
    res.redirect("back"); // Redirect to the referring page
  }
};

// Log out the user
module.exports.signout = (req, res, next) => {
  try {
    // Call the logout method to end the user's session
    req.logout((err) => {
      if (err) {
        // Handle errors during logout
        console.error("Error logging out:", err);
        return next(err); // Pass the error to the next middleware
      }

      // Flash a success message indicating successful logout
      req.flash("success", "You have successfully logged out.");
      res.redirect("/"); // Redirect to the home page
    });
  } catch (error) {
    // Handle errors during logout
    console.error("Error during logout:", error);
    req.flash("error", "An error occurred while logging out."); // Flash an error message
    res.redirect("back"); // Redirect to the referring page
  }
};
