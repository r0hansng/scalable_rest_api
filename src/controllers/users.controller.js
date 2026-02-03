import prisma from '../config/database.js';
import { AppError } from '../errors/AppError.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env, logger } from '../config/index.js';

/**
 * Create a new user (Signup)
 */
export const createUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new AppError({
        message: 'User already exists',
        statusCode: 409,
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    logger.info(`New user created: ${user.id}`, { requestId: req.requestId });

    res.status(201).json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Login user and generate JWT
 */
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AppError({
        message: 'Invalid email or password',
        statusCode: 401,
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new AppError({
        message: 'Invalid email or password',
        statusCode: 401,
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      env.jwtSecret,
      { expiresIn: env.jwtExpiresIn || '1h' },
    );

    logger.info(`User logged in: ${user.id}`, { requestId: req.requestId });

    res.status(200).json({
      success: true,
      data: {
        token,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get current logged-in user info
 */
export const getMe = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, role: true, createdAt: true },
    });

    if (!user) {
      throw new AppError({
        message: 'User not found',
        statusCode: 404,
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Delete a user (Admin only)
 */
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new AppError({
        message: 'User not found',
        statusCode: 404,
      });
    }

    await prisma.user.delete({ where: { id } });

    logger.info(`User deleted: ${id}`, { requestId: req.requestId });

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};