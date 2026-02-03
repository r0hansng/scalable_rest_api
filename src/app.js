import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import { logger } from './config/index.js';
import { errorHandler } from './middleware/error.middleware.js';
import healthRoutes from './routes/health.routes.js';
import userRoutes from './routes/user.routes.js';
import requestIdMiddleware from './middleware/requestId.middleware.js';
import { rateLimiter } from './middleware/rateLimiter.middleware.js';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestIdMiddleware);

app.use(rateLimiter());

// HTTP request logging
app.use(pinoHttp({ logger }));

app.get('/', (req, res) => {
  res.status(200).json({
    service: 'scalable-rest-api',
    status: 'running',
  });
});

// Health check route
app.use('/', healthRoutes);

// User routes
app.use('/api/v1/users', userRoutes);

// Error handling
app.use(errorHandler);

export default app;
