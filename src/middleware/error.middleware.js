import { logger } from '../config/index.js';

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Log the error with relevant info
  logger.error({
    name: err.name,
    message,
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
    requestId: req.requestId || 'N/A',
  });

  // Send standardized JSON response
  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
    requestId: req.requestId || 'N/A',
  });
};
