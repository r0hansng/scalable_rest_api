import app from './app.js';
import { env, logger } from './config/index.js';

const PORT = env.port || 3000;

const server = app.listen(PORT, () => {
  logger.info(`Server running in ${env.nodeEnv} mode on http://localhost:${PORT}`);
});

/**
 * Graceful shutdown handler
 */
async function shutdown(signal) {
  logger.info(`Received ${signal}. Shutting down gracefully...`);

  server.close(async () => {
    try {
      await prisma.$disconnect();
      logger.info('Database connection closed');
      process.exit(0);
    } catch (err) {
      logger.error('Error during shutdown', err);
      process.exit(1);
    }
  });
}

process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

/**
 * Termination signals
 */
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);