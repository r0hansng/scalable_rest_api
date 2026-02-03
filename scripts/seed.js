import prisma from '../src/config/database.js';
import { hashPassword } from '../src/utils/hash.js';
import logger from '../src/config/logger.js';

/**
 * Seed script
 * Seeds the database with an admin user
 */

async function main() {
  try {
    logger.info('Starting seed...');

    const adminEmail = 'admin@example.com';
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (!existingAdmin) {
      const hashed = await hashPassword('Admin123!');
      await prisma.user.create({
        data: {
          email: adminEmail,
          password: hashed,
          role: 'ADMIN',
        },
      });
      logger.info('Admin user created');
    }

    logger.info('Seed finished');
  } catch (err) {
    logger.error('Seed failed', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
