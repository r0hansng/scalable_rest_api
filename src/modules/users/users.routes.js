import express from 'express';
import requestId from '../../middleware/requestId.middleware.js';
import { validateRequest } from '../../middleware/validate.middleware.js';
import { authenticateUser, authorizeRoles } from '../../middleware/auth.middleware.js';
import { rateLimiter } from '../../middleware/rateLimiter.middleware.js';
import { signupSchema, loginSchema, userIdParamSchema } from './users.validation.js';
import * as usersController from './users.controller.js';

const router = express.Router();

router.use(requestId);
router.use(rateLimiter({ windowMs: 15 * 60 * 1000, max: 100 }));

// Public routes
router.post('/signup', validateRequest(signupSchema, 'body'), usersController.createUser);
router.post('/login', validateRequest(loginSchema, 'body'), usersController.loginUser);

// Protected routes
router.get('/me', authenticateUser, usersController.getMe);

// Admin-only routes
router.delete(
  '/:id',
  authenticateUser,
  authorizeRoles('ADMIN'),
  validateRequest(userIdParamSchema, 'params'),
  usersController.deleteUser,
);

export default router;
