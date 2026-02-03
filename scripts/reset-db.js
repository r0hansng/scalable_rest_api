import { execSync } from 'node:child_process';
import path from 'path';
import logger from '../src/config/logger.js';

const prismaBinary = path.resolve('node_modules/.bin/prisma');

try {
  logger.info('Resetting database...');
  execSync(`${prismaBinary} migrate reset --force`, { stdio: 'inherit' });
  logger.info('Database reset done. Run seed.js to populate initial data');
} catch (err) {
  logger.error('Database reset failed', err);
  process.exit(1);
}
