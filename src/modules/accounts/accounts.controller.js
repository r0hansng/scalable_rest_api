import { logger } from '../../config/index.js';
import asyncHandler from '../../utils/asyncHandler.js';
import {
  createAccountService,
  getAccountsByUserIdService,
  getAccountByIdForUserService,
  closeAccountForUserService,
} from './index.js';
import { getPagination, formatPaginatedResponse } from '../../utils/pagination.js';

export const createAccountController = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { initialBalance } = req.body;

  const account = await createAccountService({
    userId,
    initialBalance,
  });

  logger.info('Account created', {
    accountId: account.id,
    userId,
    requestId: req.requestId,
  });

  res.status(201).json({
    success: true,
    data: {
      id: account.id,
      balance: account.balance,
      status: account.status,
      createdAt: account.createdAt,
    },
  });
});

/**
 * Fetch all accounts for logged-in user
 */
export const getAccountsController = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const { limit, offset, page } = getPagination(req.query);

  const { accounts, total } = await getAccountsByUserIdService({
    userId,
    limit,
    offset,
  });

  logger.info('Accounts fetched', {
    userId,
    total,
    page,
    limit,
    requestId: req.requestId,
  });

  res.status(200).json({
    success: true,
    ...formatPaginatedResponse(accounts, total, page, limit),
  });
});


/**
 * GET /api/v1/accounts/:accountId
 * Fetch a single account for logged-in user
 */
export const getAccountByIdController = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { accountId } = req.params;

  const account = await getAccountByIdForUserService({
    userId,
    accountId,
  });

  if (!account) {
    return res.status(404).json({
      success: false,
      error: {
        message: 'Account not found',
      },
    });
  }

  logger.info('Account fetched', {
    userId,
    accountId,
    requestId: req.requestId,
  });

  res.status(200).json({
    success: true,
    data: {
      id: account.id,
      balance: account.balance,
      status: account.status,
      ...(account.status === 'CLOSED' && { closedAt: account.closedAt }),
    },
  });
});

/**
 * DELETE /api/v1/accounts/:accountId
 * Close an account for logged-in user
 */

export const closeAccountController = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { accountId } = req.params;

  const result = await closeAccountForUserService({ userId, accountId });

  if (result?.error === 'NOT_FOUND') {
    return res.status(404).json({
      success: false,
      error: { message: 'Account not found' },
    });
  }

  if (result?.error === 'NON_ZERO_BALANCE') {
    return res.status(409).json({
      success: false,
      error: { message: 'Account balance must be zero before closing' },
    });
  }

  if (result?.error === 'PENDING_TRANSACTIONS') {
    return res.status(409).json({
      success: false,
      error: { message: 'Account has pending transactions' },
    });
  }

  logger.info('Account closed', {
    userId,
    accountId,
    requestId: req.requestId,
  });

  res.status(200).json({
    success: true,
    message: 'Account closed successfully',
  });
});