/**
 * @fileoverview Users Module - Barrel Export
 *
 * This is the public API for the users module. It exports all consumer-facing
 * components using the barrel pattern for clean, maintainable imports.
 *
 * Architecture:
 * - Route layer (HTTP endpoints)
 * - Controller layer (request parsing, response formatting)
 * - Service layer (business logic, database operations)
 * - Validation schemas (request validation with Zod)
 *
 * @example
 * // In your main app.js
 * import { usersRouter } from './modules/users/index.js';
 * app.use('/api/users', usersRouter);
 */

/**
 * Express router with all user-related endpoints.
 * Includes middleware for authentication, authorization, rate limiting, and validation.
 *
 * Endpoints:
 * - POST /signup (public)
 * - POST /login (public)
 * - GET /me (protected)
 * - DELETE /:id (admin-only)
 *
 * @type {import('express').Router}
 */
export { default as userRoutes } from './users.routes.js';

/**
 * HTTP request handlers for user operations.
 * Thin controller layer: parses requests, delegates to services, formats responses.
 * Request validation and authentication are handled by middleware before these are called.
 *
 * Handlers:
 * - createUser: Sign up new user with email/password
 * - loginUser: Authenticate user and return JWT
 * - getMe: Retrieve authenticated user's profile
 * - deleteUser: Admin operation to delete user by ID
 *
 * @type {Object}
 */
export {
  createUser,
  loginUser,
  getMe,
  deleteUser,
} from './users.controller.js';

/**
 * Business logic service functions for user operations.
 * Handles database queries, password hashing, JWT generation, and error handling.
 * Keep these logic-heavy and side-effect-free for easy testing.
 *
 * Services (exported with 'Service' suffix to avoid naming conflicts):
 * - createUserService: Create new user with password hashing
 * - loginUserService: Validate credentials and return JWT token
 * - getMeService: Retrieve user profile (password excluded)
 * - deleteUserService: Delete user from database
 *
 * @type {Object}
 */
export {
  createUser as createUserService,
  loginUser as loginUserService,
  getMe as getMeService,
  deleteUser as deleteUserService,
} from './users.service.js';

/**
 * Zod validation schemas for user requests.
 * Used with the validateRequest middleware to ensure data integrity.
 *
 * Schemas:
 * - signupSchema: Validates email and password on signup
 * - loginSchema: Validates email and password on login
 * - userIdParamSchema: Validates UUID user ID in URL parameters
 *
 * @type {Object}
 */
export {
  signupSchema,
  loginSchema,
  userIdParamSchema,
} from './users.validation.js';
