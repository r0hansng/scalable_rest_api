import express from 'express';
import { authenticateUser } from '../../middleware/auth.middleware.js';
import { validateRequest } from '../../middleware/validate.middleware.js';
import requestId from '../../middleware/requestId.middleware.js';
import { rateLimiter } from '../../middleware/rateLimiter.middleware.js';
import { createTransactionSchema } from './transactions.validation.js';
import * as transactionsController from './transactions.controller.js';

const router = express.Router();

router.use(requestId);
router.use(rateLimiter({ windowMs: 15 * 60 * 1000, max: 100 }));

router.post(
  '/:accountId/transactions',
  authenticateUser,
  validateRequest(createTransactionSchema),
  transactionsController.createTransactionController,
);

export default router;
