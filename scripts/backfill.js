import { PrismaClient } from '../src/generated/prisma/index.js';
import logger from '../src/config/logger.js';

const prisma = new PrismaClient();

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
