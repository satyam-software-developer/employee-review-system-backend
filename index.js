// Load environment variables from a .env file
require("dotenv").config();

// Connect to the database
require("./config/mongoose").connect();

// Importing dependencies
const express = require("express"); // Web framework
const passport = require("passport"); // Authentication middleware
const cookieParser = require("cookie-parser"); // Parse cookies
const session = require("express-session"); // Session management
const expressLayouts = require("express-ejs-layouts"); // Layouts middleware
const flash = require("connect-flash"); // Flash messages
const MongoStore = require("connect-mongo"); // Store sessions in MongoDB
const myMiddleware = require("./config/middleware"); // Custom middleware
require("./config/passport_local"); // Passport Local strategy

// Server configuration
const PORT = process.env.PORT || 3000; // Default port is 3000
const MONGODB_URL =
  process.env.MONGODB_URL ||
  "mongodb+srv://krsatyam0506:ghhloYAlLIwqyZ5H@cluster0.iw1gp.mongodb.net/"; // Replace with your MongoDB URL

// Initialize Express app
const app = express();

// Middleware setup
app.use(express.json()); // Parse incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(express.static("assets")); // Serve static files
app.use(cookieParser()); // Parse cookies
app.use(expressLayouts); // Enable layouts

// Extract styles and scripts for layouts
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", "./views");

// Configure session
app.use(
  session({
    secret: process.env.SECRET_KEY || "default-secret-key", // Secret key for sessions
    resave: false, // Don't resave unmodified sessions
    saveUninitialized: false, // Don't save uninitialized sessions
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // Cookie expiry (1 day)
      secure: process.env.NODE_ENV === "production", // Use HTTPS in production
    },
    store: MongoStore.create({
      mongoUrl: MONGODB_URL, // MongoDB session store
      collectionName: "sessions", // Collection for session storage
    }),
  })
);

// Enable flash messages
app.use(flash());
app.use(myMiddleware.setFlash); // Custom middleware for flash messages

// Initialize Passport.js for authentication
app.use(passport.initialize());
app.use(passport.session());

// Set the authenticated user in locals for views
app.use(passport.setAuthenticatedUser);

// Define application routes
app.use("/", require("./routes")); // Main router

// Start the server
app.listen(PORT, () => console.log(`🚀 Server is running on port: ${PORT}`));
