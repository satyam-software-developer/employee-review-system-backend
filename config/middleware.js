// Middleware to set flash notifications
const setFlash = (req, res, next) => {
  /**
   * The `setFlash` middleware attaches flash messages to the `res.locals` object.
   * Flash messages are temporary messages (e.g., success or error notifications) 
   * that are stored in the session and displayed to the user on the next page load.
   * Once accessed, these messages are automatically cleared from the session.
   * 
   * By attaching these messages to `res.locals.flash`, they become available in views (templates),
   * allowing the application to dynamically display notifications to the user.
   */

  res.locals.flash = {
    /**
     * Retrieve success flash messages stored in the session using `req.flash("success")`.
     * These messages are typically used to notify users of successful operations.
     * Example usage in a controller: `req.flash("success", "Your account has been created successfully.");`
     * The message will then be accessible in the template as `flash.success`.
     */
    success: req.flash("success"),

    /**
     * Retrieve error flash messages stored in the session using `req.flash("error")`.
     * These messages are used to notify users of errors or issues during an operation.
     * Example usage in a controller: `req.flash("error", "Invalid email or password.");`
     * The message will then be accessible in the template as `flash.error`.
     */
    error: req.flash("error"),
  };

  /**
   * Call the `next()` function to pass control to the next middleware or route handler.
   * This ensures the request-response cycle continues seamlessly.
   */
  next();
};

export default { setFlash };
