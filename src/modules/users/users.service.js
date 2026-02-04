import prisma from '../../config/database.js';
import { AppError } from '../../errors/AppError.js';
import { NotFoundError } from '../../errors/NotFoundError.js';
import { ConflictError } from '../../errors/ConflictError.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env, logger } from '../../config/index.js';

/**
 * Create a new user (signup). Hashes password and persists user.
 * @param {{ email: string, password: string }}
 * @param {{ requestId?: string }} options
 * @returns {{ id: string, email: string, role: string }}
 */

export const createUser = async ({ email, password }, options = {}) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new ConflictError('User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, password: hashedPassword },
  });

  logger.info(`New user created: ${user.id}`, { requestId: options.requestId });

  return {
    id: user.id,
    email: user.email,
    role: user.role,
  };
};

/**
 * Authenticate user and return JWT.
 * @param {{ email: string, password: string }}
 * @param {{ requestId?: string }} options
 * @returns {{ token: string }}
 */
export const loginUser = async ({ email, password }, options = {}) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AppError({ message: 'Invalid email or password', statusCode: 401 });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw new AppError({ message: 'Invalid email or password', statusCode: 401 });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn || '1h' },
  );

  logger.info(`User logged in: ${user.id}`, { requestId: options.requestId });

  return { token };
};

/**
 * Get user profile by id (for authenticated user).
 * @param {string} userId
 * @returns {Promise<{ id: string, email: string, role: string, createdAt: Date }>}
 */
export const getMe = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, role: true, createdAt: true },
  });

  if (!user) {
    throw new NotFoundError('User');
  }

  return user;
};

/**
 * Delete user by id (admin). Throws if user not found.
 * @param {string} id
 * @param {{ requestId?: string }} options
 */
export const deleteUser = async (id, options = {}) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new NotFoundError('User');
  }

  await prisma.user.delete({ where: { id } });
  logger.info(`User deleted: ${id}`, { requestId: options.requestId });
};
