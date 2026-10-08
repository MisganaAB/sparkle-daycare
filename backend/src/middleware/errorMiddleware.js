/**
 * Centralized error handler. Must be registered after all routes.
 */
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  console.error('[Error]', err);

  const status = err.status || err.statusCode || 500;
  const message =
    process.env.NODE_ENV === 'production'
      ? 'Something went wrong. Please try again.'
      : err.message || 'Internal server error';

  res.status(status).json({ success: false, message });
}

/**
 * 404 handler for unmatched routes.
 */
export function notFound(req, res) {
  res.status(404).json({ success: false, message: 'Route not found.' });
}
