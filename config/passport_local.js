// Import required modules
const passport = require("passport"); // Passport for authentication
const LocalStrategy = require("passport-local").Strategy; // Local strategy for username/password authentication
const bcrypt = require("bcryptjs"); // For password hashing and comparison
const User = require("../models/User"); // User model for database interaction

// Setting up the Local Strategy for authentication
passport.use(
  new LocalStrategy(
    {
      usernameField: "email", // Specify the field used for login (default is 'username'; here we use 'email')
      passReqToCallback: true, // Pass the request object to the callback function
    },
    // Authentication callback function
    async (req, email, password, done) => {
      try {
        // Find the user in the database by email
        const user = await User.findOne({ email });

        // If no user is found with the provided email
        if (!user) {
          return done(null, false, { message: "Incorrect username." }); // Provide an error message
        }

        // Compare the provided password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);

        // If the password does not match
        if (!isMatch) {
          return done(null, false, { message: "Incorrect password." }); // Provide an error message
        }

        // If authentication is successful, return the user object
        return done(null, user);
      } catch (err) {
        // Handle any unexpected errors during the authentication process
        return done(err);
      }
    }
  )
);

// Serialize the user into the session
passport.serializeUser((user, done) => {
  // Store only the user ID in the session for simplicity and security
  done(null, user.id);
});

// Deserialize the user from the session
passport.deserializeUser(async (id, done) => {
  try {
    // Find the user in the database using the ID stored in the session
    const user = await User.findById(id);

    // If the user is not found in the database
    if (!user) {
      return done(new Error("User not found")); // Provide an error
    }

    // If user is found, pass the user object to the next middleware
    done(null, user);
  } catch (err) {
    // Handle any errors that occur during the process
    done(err);
  }
});

// Middleware to check if the user is authenticated
passport.checkAuthentication = (req, res, next) => {
  // If the user is authenticated, allow them to proceed to the next middleware/route
  if (req.isAuthenticated()) {
    return next();
  }

  // If not authenticated, redirect the user to the login page
  return res.redirect("/");
};

// Middleware to set the authenticated user for the views
passport.setAuthenticatedUser = (req, res, next) => {
  // If the user is authenticated, set the user object in the response locals
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
  }

  // Proceed to the next middleware/route
  next();
};

// Middleware to check if the user has an admin role
passport.isAdmin = (req, res, next) => {
  // If the authenticated user has the role 'Admin', allow access
  if (req.user && req.user.role === "Admin") {
    return next();
  }

  // If not an admin, redirect back to the previous page
  return res.redirect("back");
};

// Middleware to check if the user has an employee role
passport.isEmployee = (req, res, next) => {
  // If the authenticated user has the role 'Employee', allow access
  if (req.user && req.user.role === "Employee") {
    return next();
  }

  // If not an employee, redirect back to the previous page
  return res.redirect("back");
};

// Exporting the configured passport instance for use in other parts of the application
module.exports = passport;
