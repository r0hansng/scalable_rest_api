import { PrismaClient } from '../src/generated/prisma/index.js';
import logger from '../src/config/logger.js';

const prisma = new PrismaClient();

async function main() {
  try {
    logger.info('Checking database connection...');
    await prisma.$connect();

    const userCount = await prisma.user.count();
    logger.info(`Number of users: ${userCount}`);
  } catch (err) {
    logger.error('Health check failed', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
