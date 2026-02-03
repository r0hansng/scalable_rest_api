import { PrismaClient } from '@prisma/client';
import { env } from './env.js';
import logger from './logger.js';

/**
 * Prisma database client
 *
 * This file is responsible ONLY for:
 * - Creating the Prisma client
 * - Providing a single shared instance
 */

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn'] : ['error'],
});

prisma.$on('error', (err) => logger.error(err));
prisma.$on('info', (info) => logger.info(info));

export default prisma;