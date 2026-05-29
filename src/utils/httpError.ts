/**
 * Creates an Error with an attached HTTP status code.
 * Thrown errors are picked up by the central error handler in server.ts.
 */
export function createError(
  status: number,
  message: string,
): Error & { status: number } {
  const err = new Error(message) as Error & { status: number };
  err.status = status;
  return err;
}
