import { PrismaClient } from '../src/generated/prisma/index.js';
import { hashPassword } from '../src/utils/hash.js';
import logger from '../src/config/logger.js';

const prisma = new PrismaClient();

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
