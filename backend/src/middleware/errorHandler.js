function errorHandler(err, req, res, next) {
  console.error(err);
  res.status(err.status || 500).json({
    success: false,
    error: err.status === 404 ? 'Not Found' : 'Internal server error',
    details: err.message
  });
}

module.exports = { errorHandler };
