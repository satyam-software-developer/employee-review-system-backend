// Import required modules
import passport from "passport"; // Passport for authentication
import { Strategy as LocalStrategy } from "passport-local"; // Local strategy for username/password authentication
import bcrypt from "bcryptjs"; // For hashing and comparing passwords
import User from "../models/User.js"; // User model for database operations

// Initialize the Local Strategy
passport.use(
  new LocalStrategy(
    {
      usernameField: "email", // Using email as the username field
      passReqToCallback: true, // Enables access to the `req` object
    },
    async (req, email, password, done) => {
      try {
        // Find user by email
        const user = await User.findOne({ email });

        // If user not found, return an error message
        if (!user) {
          return done(null, false, { message: "User not found." });
        }

        // Compare the entered password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        // If passwords do not match, return an error message
        if (!isMatch) {
          return done(null, false, { message: "Invalid password." });
        }

        // If authentication is successful, return the user object
        return done(null, user);
      } catch (error) {
        // Handle errors during the authentication process
        console.error("Error during authentication:", error);
        return done(error);
      }
    }
  )
);

// Serialize the user (store only the user ID in the session)
passport.serializeUser((user, done) => {
  done(null, user.id); // Serialize the user ID to the session
});

// Deserialize the user (fetch the full user object from the session)
passport.deserializeUser(async (id, done) => {
  try {
    // Attempt to find the user by their ID
    const user = await User.findById(id);

    if (!user) {
      console.error(`User with ID ${id} not found during deserialization.`);
      return done(null, false, { message: "User not found" }); // Ends session for non-existent user
    }

    // Successfully found user, return the user object
    done(null, user);
  } catch (error) {
    // Handle errors during the deserialization process
    console.error("Error during user deserialization:", error);
    done(error, false); // End session on error
  }
});

// Middleware to check if a user is authenticated
passport.checkAuthentication = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next(); // Proceed if authenticated
  }
  return res.redirect("/"); // Redirect to login page if not authenticated
};

// Middleware to set the authenticated user in response locals
passport.setAuthenticatedUser = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.locals.user = req.user; // Makes user accessible in templates
  }
  next(); // Proceed to the next middleware
};

// Middleware to check if the authenticated user is an Admin
passport.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "Admin") {
    return next(); // Proceed if user is an Admin
  }
  return res.redirect("back"); // Redirect to the previous page if not an Admin
};

// Middleware to check if the authenticated user is an Employee
passport.isEmployee = (req, res, next) => {
  if (req.user && req.user.role === "Employee") {
    return next(); // Proceed if user is an Employee
  }
  return res.redirect("back"); // Redirect to the previous page if not an Employee
};

// Export the configured passport instance
export default passport;
