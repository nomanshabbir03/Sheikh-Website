// errorHandler.js
// Global error handling middleware — catches all unhandled errors
// Must be registered LAST in index.js after all routes

export function errorHandler(err, req, res, next) {
  console.error('❌ Error:', err.message)

  // Validation errors from express-validator
  if (err.type === 'validation') {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: err.details,
    })
  }

  // Supabase errors
  if (err.code && err.message) {
    return res.status(500).json({
      success: false,
      error: 'Database error',
      message: err.message,
    })
  }

  // Generic fallback
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
  })
}