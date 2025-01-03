## Employee Review System

1. Git repository link: https://github.com/satyam-software-developer/employee-review-system-backend.git
2. Hosted link: https://employee-review-system-backend.onrender.com/

# Description

This project is a web application designed to facilitate the process of employee performance reviews. It allows employees to submit feedback on each other’s performance, while also enabling an admin to manage employees, view feedback, and assign reviews.

# Features:

- Admin View:
  - Add, remove, update, and view employees
  - Add, update, and view performance reviews
  - Assign employees to participate in performance reviews
- Employee View:
  - View performance reviews requiring feedback
  - Submit feedback on the performance of other employees
- Authentication:
  - Single login system for both admin and employees
  - Employee registration is open, but only admin can make an employee an admin

# Table of Contents

1.  Tech Stack
2.  Installation
3.  Folder Structure
4.  Usage
5.  Contributing
6.  License

# Tech Stack

- Frontend:
  - HTML, CSS, JavaScript
  - Bootstrap (CSS framework for responsive design)
- Backend:
  - Node.js
  - Express.js
  - MongoDB (for storing user data and feedback)
  - Passport.js (for authentication)
- Tools:
  - EJS (templating engine)
  - Git (version control)

# Installation

1. Clone the repository
   To get started with the project, clone the repository to your local machine:

   git clone https://github.com/satyam-software-developer/employee-review-system-backend.git

2. Install dependencies
   Navigate to the project directory and install the required dependencies:
   cd employee-review-system
   npm install
3. Environment Variables
   Make sure to set up your environment variables by creating a .env file in the root directory with the following configuration:
   PORT=3000
   MONGODB_URL=mongodb+srv://krsatyam0506:ghhloYAlLIwqyZ5H@cluster0.iw1gp.mongodb.net/
   SECRET_KEY=your_secret_key
   You can replace your_secret_key with any string you choose for securing sessions.
4. Run the project
   After installing dependencies and setting up your environment variables, you can start the project by running the following command:
   nodemon index.js
   This will start the server on http://localhost:3000.

# Folder Structure

Here is the folder structure of the project:
employee-review-system/
│
├── config/ # Contains configuration files (passport, mongoose, etc.)
│ ├── mongoose.js # Database connection setup
│ ├── passport_local.js # Passport Local authentication strategy
│ └── middleware.js # Custom middlewares
│
├── models/ # Mongoose models (Employee, Review, etc.)
│ ├── employee.js # Employee schema and model
│ ├── review.js # Review schema and model
│ └── feedback.js # Feedback schema and model
│
├── routes/ # Contains all route handlers
│ ├── admin.js # Admin-specific routes
│ ├── employee.js # Employee-specific routes
│ └── index.js # General routes (e.g., home, login, register)
│
├── views/ # EJS templates for frontend
│ ├── dashboard.ejs # Admin dashboard view
│ ├── employee.ejs # Employee dashboard view
│ ├── login.ejs # Login form view
│ └── register.ejs # Registration form view
│
├── public/ # Public files (CSS, JS, Images)
│ └── styles.css # Custom CSS file for styling
│
├── .env # Environment variables
├── app.js # Main server file (entry point)
├── package.json # Project dependencies and metadata
└── README.md # Project documentation (this file)

# Usage

- Admin Workflow:
  1. Login/Logout: Admin can log in using their credentials and log out when done.
  2. Manage Employees: Admin can add, remove, or update employees from the admin dashboard.
  3. Assign Reviews: Admin can assign employees to submit feedback on specific performance reviews.
  4. Manage Reviews: Admin can add and update performance reviews for employees.
- Employee Workflow:
  1. Login/Logout: Employees can log in using their credentials.
  2. View Reviews: Employees can view reviews assigned to them for feedback.
  3. Submit Feedback: Employees can submit feedback on a colleague’s performance.

# Contributing

Contributions are welcome! If you'd like to contribute to the project, please follow these steps:

1.  Fork the repository.
2.  Create a new branch (git checkout -b feature-name).
3.  Commit your changes (git commit -am 'Add new feature').
4.  Push to the branch (git push origin feature-name).
5.  Open a pull request.

# License

This project is licensed under the MIT License - see the LICENSE file for details.

# DEMO

- https://employeereviewsytemapp.onrender.com/

# Author

SATYAM KUMAR
