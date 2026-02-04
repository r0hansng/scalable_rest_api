import express from 'express';
import * as accountsController from './accounts.controller.js';
import { authenticateUser } from '../../middleware/auth.middleware.js';
import { validateRequest } from '../../middleware/validate.middleware.js';
import { createAccountSchema } from './accounts.validation.js';
import requestId from '../../middleware/requestId.middleware.js';
import { rateLimiter } from '../../middleware/rateLimiter.middleware.js';
import { transactionsRoutes } from '../transactions/index.js';

const router = express.Router();

router.use(requestId);
router.use(rateLimiter({ windowMs: 15 * 60 * 1000, max: 100 }));

/**
 * POST /api/v1/accounts
 * Create a new account for logged-in user
 */
router.post(
  '/',
  authenticateUser,
  validateRequest(createAccountSchema),
  accountsController.createAccountController,
);

router.get('/', authenticateUser, accountsController.getAccountsController);
router.get('/:accountId', authenticateUser, accountsController.getAccountByIdController);

router.delete('/:accountId', authenticateUser, accountsController.closeAccountController);

router.use('/', transactionsRoutes);

export default router;
