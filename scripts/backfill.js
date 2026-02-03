import prisma from '../src/config/database.js';
import logger from '../src/config/logger.js';

/**
 * Backfill script
 * Backfills the accounts with a balance of 0
 */

async function main() {
  try {
    logger.info('Starting backfill');

    const accounts = await prisma.account.findMany({ where: { balance: null } });

    for (const account of accounts) {
      await prisma.account.update({
        where: { id: account.id },
        data: { balance: 0 },
      });
      logger.info(`Backfilled account ${account.id}`);
    }

    logger.info('Backfill done');
  } catch (err) {
    logger.error('Backfill failed', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
