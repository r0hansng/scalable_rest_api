import { PrismaClient } from '@prisma/client';
import logger from './logger.js';
import { env } from './env.js'; // optional if you read DATABASE_URL from env

/**
 * Prisma database client
 *
 * - Single shared instance
 * - Logs queries in development
 */

const prisma = new PrismaClient({
  log: env.NODE_ENV === 'development' ? ['query', 'info', 'warn'] : ['error'],
});

// Log errors and info
prisma.$on('error', (err) => logger.error('Prisma error', err));
prisma.$on('info', (info) => logger.info('Prisma info', info));

// Optional: debug slow queries
if (env.NODE_ENV === 'development') {
  prisma.$on('query', (e) => {
    logger.info(`Query: ${e.query} | Duration: ${e.duration}ms`);
  });
}

export default prisma;
