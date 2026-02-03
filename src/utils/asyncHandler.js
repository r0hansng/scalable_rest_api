/**
 * Wraps an async route/controller function in try/catch
 * and forwards errors to Express errorHandler
 *
 * @param {Function} fn - async function (req, res, next)
 * @returns {Function} Express route handler
 */
const asyncHandler = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      next(err); // forward error to centralized error handler
    }
  };
};

export default asyncHandler;
