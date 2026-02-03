import express from 'express';
import { z } from 'zod';
import requestId  from '../middleware/requestId.middleware.js';
import { validateRequest } from '../middleware/validate.middleware.js';
import { authenticateUser, authorizeRoles } from '../middleware/auth.middleware.js';
import { rateLimiter } from '../middleware/rateLimiter.middleware.js';
import * as usersController from '../controllers/users.controller.js';

const router = express.Router();

// Attach requestId for tracing
router.use(requestId);

// Rate limiting for all user routes
router.use(rateLimiter({ windowMs: 15 * 60 * 1000, max: 100 }));

// -------------------------
// Schemas
// -------------------------
const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// -------------------------
// Public routes
// -------------------------
router.post('/signup', validateRequest(signupSchema, 'body'), usersController.createUser);
router.post('/login', validateRequest(loginSchema, 'body'), usersController.loginUser);

// -------------------------
// Protected routes
// -------------------------
router.get('/me', authenticateUser, usersController.getMe);

// Admin-only routes
router.delete('/:id', authenticateUser, authorizeRoles('ADMIN'), usersController.deleteUser);

export default router;