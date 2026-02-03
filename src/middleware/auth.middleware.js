import jwt from 'jsonwebtoken';
import { env } from '../config/index.js'; // central config export
import { AuthorizationError } from '../errors/AuthorizationError.js';

/**
 * Authentication middleware
 * - Verifies JWT token from Authorization header
 * - Attaches decoded user payload to req.user
 */
export const authenticateUser = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return next(new AuthorizationError('Missing Authorization header'));
  }

  const token = authHeader.split(' ')[1]; // Expecting "Bearer <token>"
  if (!token) {
    return next(new AuthorizationError('Invalid token format'));
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret); // use env from config/index.js
    req.user = payload; // { id, email, role }
    next();
  } catch (err) {
    return next(new AuthorizationError('Invalid or expired token'));
  }
};

/**
 * Authorization middleware
 * - Restrict access to specific roles
 * @param  {...string} allowedRoles - e.g., 'ADMIN', 'USER'
 */
export const authorizeRoles = (...allowedRoles) => (req, res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return next(new AuthorizationError('Access denied'));
  }
  next();
};