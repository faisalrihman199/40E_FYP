import logger from '../config/logger.js';

const errorHandler = (err, req, res, next) => {
  // Log error
  logger.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userId: req.user?.userId
  });

  // Default error status and message
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal server error';

  // Send error response
  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      details: err
    })
  });
};

export default errorHandler;
