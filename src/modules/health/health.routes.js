import express from 'express';
import prisma from '../../config/database.js';
import logger from '../../config/logger.js';

const router = express.Router();

/**
 * Liveness probe
 * Confirms the process is running
 */
router.get('/healthz', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'scalable-rest-api',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    requestId: req.id,
  });
});

/**
 * Readiness probe
 * Confirms required dependencies are reachable
 */
router.get('/readyz', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      status: 'ready',
      database: 'connected',
      requestId: req.id,
    });
  } catch (err) {
    logger.error('Readiness check failed', {
      requestId: req.id,
      error: err,
    });

    res.status(503).json({
      status: 'not_ready',
      database: 'unreachable',
      requestId: req.id,
    });
  }
});

export default router;
