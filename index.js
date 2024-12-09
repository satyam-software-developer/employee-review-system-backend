// Load environment variables from a .env file
require("dotenv").config();

// Database connection setup
const mongoose = require("./config/mongoose");
// Connect to MongoDB database
mongoose.connect();

// Importing required dependencies
const express = require("express"); // Web framework
const passport = require("passport"); // Authentication middleware
const cookieParser = require("cookie-parser"); // Middleware to parse cookies
const session = require("express-session"); // Middleware to handle sessions
const expressLayouts = require("express-ejs-layouts"); // Middleware for EJS layouts
const flash = require("connect-flash"); // Middleware for flash messages
const MongoStore = require("connect-mongo"); // Store sessions in MongoDB
const myMiddleware = require("./config/middleware"); // Custom middleware for setting flash messages
require("./config/passport_local"); // Initialize Passport Local strategy for user authentication

// Constants for configuration
const PORT = process.env.PORT || 3000; // Render will automatically provide the PORT environment variable
const MONGODB_URL =
  process.env.MONGODB_URL ||
  "mongodb+srv://krsatyam0506:ghhloYAlLIwqyZ5H@cluster0.iw1gp.mongodb.net/"; // Replace with your MongoDB URI

// Initialize Express application
const app = express();

// Middleware for parsing incoming requests
app.use(express.json()); // Parse incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded requests (forms)

// Serve static files (like images, styles, etc.) from the 'assets' directory
app.use(express.static("assets"));

// Middleware for parsing cookies
app.use(cookieParser());

// Middleware for using EJS layouts (used for template inheritance)
app.use(expressLayouts);
app.set("layout extractStyles", true); // Extract styles for layouts
app.set("layout extractScripts", true); // Extract scripts for layouts

// Set up EJS view engine and specify the directory for views
app.set("view engine", "ejs"); // Use EJS as the templating engine
app.set("views", "./views"); // Specify the directory for views

// Configure session management
app.use(
  session({
    secret: process.env.SECRET_KEY || "your-secret-key", // Use SECRET_KEY from environment variables
    resave: false, // Don't force a session to be saved if it wasn't modified
    saveUninitialized: false, // Don't save uninitialized sessions
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // Session expiry time (1 day in milliseconds)
      secure: process.env.NODE_ENV === "production", // Ensure cookies are only sent over HTTPS in production
    },
    store: MongoStore.create({
      mongoUrl: MONGODB_URL, // MongoDB connection URL for session storage
      collectionName: "sessions", // Optional: specify the collection name for storing sessions in MongoDB
      ttl: 24 * 60 * 60, // Time-to-live for sessions (1 day in seconds)
    }),
  })
);

// Enable flash messages for user feedback (success/error messages)
app.use(flash());
// Custom middleware to set flash messages in locals (for use in views)
app.use(myMiddleware.setFlash);

// Initialize Passport.js for handling authentication
app.use(passport.initialize()); // Initialize Passport
app.use(passport.session()); // Enable session handling with Passport

// Store authenticated user in local variables for use in views
app.use(passport.setAuthenticatedUser);

// Define application routes
app.use("/", require("./routes")); // Use routes defined in the routes directory

// Start the Express server
app.listen(PORT, () =>
  console.log(`🚀 Server is running on http://localhost:${PORT}`)
);
