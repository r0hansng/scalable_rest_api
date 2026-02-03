import express from 'express';
import prisma from '../config/database.js';
import logger from '../config/logger.js';

const router = express.Router();

/**
 * GET /
 * Basic health check for the API
 */
router.get('/', async (req, res) => {
  try {
    // DB ping
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      status: 'ok',
      message: 'Server is running',
      environment: process.env.NODE_ENV,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    logger.error('Health check failed', err);

    res.status(500).json({
      status: 'error',
      message: 'Server is up but database is unreachable',
    });
  }
});

export default router;
