/**
 * Creates an Error with an attached HTTP status code.
 * Thrown errors are picked up by the central error handler in server.js
 * which reads `err.status` to set the response status code.
 *
 * @param {number} status  HTTP status code (e.g. 404, 403)
 * @param {string} message Human-readable error message
 * @returns {Error}
 *
 * @example
 * if (!team) throw createError(404, "Team not found.");
 */
export function createError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}
