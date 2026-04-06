const errorHandler = (err, req, res, _next) => {
  console.error('Error:', err.message);

  const statusCode = err.statusCode || 500;
  const isProduction = process.env.NODE_ENV === 'production';

  const response = {
    success: false,
    error: {
      code: err.code || 'INTERNAL_ERROR',
      // Never expose internal error messages in production
      message: isProduction ? 'An unexpected error occurred' : (err.message || 'An unexpected error occurred'),
    },
  };

  if (!isProduction) {
    response.error.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
