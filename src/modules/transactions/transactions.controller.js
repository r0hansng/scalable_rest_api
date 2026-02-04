import asyncHandler from '../../utils/asyncHandler.js';
import { logger } from '../../config/index.js';
import { createTransactionService } from './index.js';

export const createTransactionController = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { accountId } = req.params;
  const { amount, type, idempotencyKey } = req.body;

  try {
    const transaction = await createTransactionService({
      userId,
      accountId,
      amount,
      type,
      idempotencyKey,
    });

    logger.info('Transaction processed', {
      transactionId: transaction.id,
      accountId,
      userId,
      requestId: req.requestId,
    });

    res.status(201).json({
      success: true,
      data: {
        id: transaction.id,
        status: transaction.status,
        amount: transaction.amount,
      },
    });
  } catch (err) {
    if (err.message === 'ACCOUNT_NOT_FOUND') {
      return res.status(404).json({
        success: false,
        error: { message: 'Account not found' },
      });
    }

    if (err.message === 'INSUFFICIENT_FUNDS') {
      return res.status(409).json({
        success: false,
        error: { message: 'Insufficient balance' },
      });
    }

    throw err;
  }
});
