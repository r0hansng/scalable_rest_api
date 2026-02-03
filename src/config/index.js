/** 
 * Central configuration entry point
 * Export all core configs from a single file for easier imports
*/

import { env } from './env.js';
import prisma from './database.js';
import logger from './logger.js';

export {
  env,
  prisma,
  logger,
};
