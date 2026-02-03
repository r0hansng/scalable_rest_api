import pino from 'pino';
import path from 'path';
import fs from 'fs';

const isDevelopment = process.env.NODE_ENV === 'development';

// Ensure logs directory exists
const logDir = path.resolve(process.cwd(), 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// File paths
const combinedLogPath = path.join(logDir, 'combined.log');
const errorLogPath = path.join(logDir, 'error.log');

// Transport targets
const targets = [
  // All info+ logs go to combined.log
  {
    target: 'pino/file',
    level: 'info',
    options: { destination: combinedLogPath },
  },
  // Errors go to error.log
  {
    target: 'pino/file',
    level: 'error',
    options: { destination: errorLogPath },
  },
];

// In development, also pretty-print logs to console
if (isDevelopment) {
  targets.unshift({
    target: 'pino-pretty',
    level: 'debug',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
    },
  });
}

// Create the logger
const logger = pino(
  {
    level: isDevelopment ? 'debug' : 'info',
    base: null, // disables pid and hostname fields for cleaner logs
  },
  pino.transport({ targets }),
);

export default logger;
