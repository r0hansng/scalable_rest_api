import { execSync } from 'node:child_process';
import logger from '../src/config/logger.js';

try {
  logger.info('Running migrations...');
  execSync('npx prisma migrate dev --name init', { stdio: 'inherit' });
  logger.info('Migrations finished');
} catch (err) {
  logger.error('Migration failed', err);
  process.exit(1);
}
