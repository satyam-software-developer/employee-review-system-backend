// Middleware to set flash notifications
module.exports.setFlash = (req, res, next) => {
  /**
   * Attach flash messages to the `res.locals` object.
   * `res.locals` is a special object that allows you to pass data to the views (templates).
   * Flash messages are temporary messages that are shown to the user on the next page render and then removed.
   */

  res.locals.flash = {
    /**
     * Attach success flash messages to the `flash.success` property of `res.locals`.
     * These messages will be fetched from the request's flash storage.
     * Example: req.flash("success", "Operation completed successfully");
     */
    success: req.flash("success"),

    /**
     * Attach error flash messages to the `flash.error` property of `res.locals`.
     * These messages will be fetched from the request's flash storage.
     * Example: req.flash("error", "An error occurred while processing your request");
     */
    error: req.flash("error"),
  };

  /**
   * Call `next()` to pass control to the next middleware in the stack
   * or to the route handler if this is the last middleware.
   * This ensures the request-response cycle continues.
   */
  next();
};
