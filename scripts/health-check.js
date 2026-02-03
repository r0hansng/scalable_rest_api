import prisma from '../src/config/database.js';
import logger from '../src/config/logger.js';

/**
 * Health check script
 * Checks the database connection and the number of users in the database
 */
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
