// Importing necessary modules
import User from "../models/User.js"; // User model for interacting with the users collection in the database
import bcrypt from "bcryptjs"; // Library for hashing passwords securely

// Render the homepage or login page
export const home = (req, res) => {
  try {
    if (req.isAuthenticated()) {
      const { role } = req.user;
      return role === "Admin"
        ? res.redirect("/dashboard/admin")
        : res.redirect("/dashboard/employee");
    }

    res.render("signIn", { title: "Sign In" });
  } catch (error) {
    console.error("Error rendering home page:", error);
    req.flash("error", "An error occurred while loading the page.");
    res.redirect("/");
  }
};

// Render the signup page
export const signUp = (req, res) => {
  try {
    if (req.isAuthenticated()) {
      const { role } = req.user;
      return role === "Admin"
        ? res.redirect("/dashboard/admin")
        : res.redirect("/dashboard/employee");
    }

    res.render("signUp", { title: "Sign Up" });
  } catch (error) {
    console.error("Error rendering signup page:", error);
    req.flash("error", "An error occurred while loading the page.");
    res.redirect("/");
  }
};

// Create a new user account
export const createAccount = async (req, res) => {
  try {
    const { name, email, password, cnf_password, role } = req.body;

    // Normalize email to avoid duplicates due to case sensitivity
    const normalizedEmail = email.trim().toLowerCase();

    // Check if the user already exists
    const userExist = await User.findOne({ email: normalizedEmail });
    if (userExist) {
      req.flash("error", "User already exists. Please log in.");
      return res.redirect("/");
    }

    // Check if passwords match
    if (password !== cnf_password) {
      req.flash("error", "Passwords do not match.");
      return res.redirect("back");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    await User.create({
      name,
      email: normalizedEmail,
      role,
      password: hashedPassword,
    });

    req.flash("success", "Account created successfully! Please log in.");
    res.status(201).redirect("/");
  } catch (error) {
    console.error("Error creating account:", error);
    req.flash("error", "An error occurred while creating the account.");
    res.redirect("back");
  }
};

// Create a session for the user
export const createSession = (req, res) => {
  try {
    const { role } = req.user;
    req.flash("success", "Welcome, you are logged in!");
    return role === "Admin"
      ? res.redirect("/dashboard/admin")
      : res.redirect("/dashboard/employee");
  } catch (error) {
    console.error("Error creating session:", error);
    req.flash("error", "An error occurred while logging in.");
    res.redirect("back");
  }
};

// Log out the user
export const signout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      console.error("Error logging out:", err);
      req.flash("error", "An error occurred while logging out.");
      return next(err);
    }
    req.flash("success", "You have successfully logged out.");
    res.redirect("/");
  });
};
