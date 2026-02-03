import app from './app.js';
import { env, logger } from './config/index.js';

const PORT = env.port || 3000;

const server = app.listen(PORT, () => {
  logger.info(`Server running in ${env.nodeEnv} mode on http://localhost:${PORT}`);
});

process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});
