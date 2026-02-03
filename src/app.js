import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import pinoHttp from 'pino-http';
import { logger } from './config/index.js';
import { errorHandler } from './errors/errorHandler.js';
import healthRoutes from './routes/health.routes.js';
import requestIdMiddleware from './middleware/requestId.middleware.js';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestIdMiddleware);

// Rate limiting
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests, please try again later.',
  }),
);

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

// Error handling
app.use(errorHandler);

export default app;
