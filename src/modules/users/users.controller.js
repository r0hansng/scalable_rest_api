import asyncHandler from '../../utils/asyncHandler.js';
import { logger } from '../../config/index.js';
import { createUserService, loginUserService, getMeService, deleteUserService } from './index.js';

/**
 * Thin controller layer: extracts request data, calls service, sends response.
 * Validation and auth are handled by middleware before reaching these handlers.
 */

export const createUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  logger.info(`User signup attempt for email: ${email}`, { requestId: req.requestId });
  const data = await createUserService({ email, password }, { requestId: req.requestId });
  res.status(201).json({ success: true, data });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  logger.info(`User login attempt for email: ${email}`, { requestId: req.requestId });
  const data = await loginUserService({ email, password }, { requestId: req.requestId });
  res.status(200).json({ success: true, data });
});

export const getMe = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  logger.debug(`Fetching profile for user: ${userId}`, { requestId: req.requestId });
  const data = await getMeService(userId);
  res.status(200).json({ success: true, data });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  logger.info(`Deleting user: ${id}`, { requestId: req.requestId });
  await deleteUserService(id, { requestId: req.requestId });
  res.status(200).json({
    success: true,
    message: 'User deleted successfully',
  });
});
