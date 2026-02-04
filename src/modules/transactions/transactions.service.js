import prisma from '../../config/database.js';
import { Prisma } from '@prisma/client';
import { processIdempotentTransaction } from '../../utils/idempotency.js';

/**
 * Create a transaction and mutate balance atomically
 */
export const createTransactionForAccount = async ({
  userId,
  accountId,
  amount,
  type,
  idempotencyKey,
}) => {
  return processIdempotentTransaction(idempotencyKey, async () => {
    return prisma.$transaction(async (tx) => {
      // 1. Validate account ownership & status
      const account = await tx.account.findFirst({
        where: {
          id: accountId,
          userId,
          status: 'ACTIVE',
        },
      });

      if (!account) {
        throw new Error('ACCOUNT_NOT_FOUND');
      }

      const delta = type === 'DEBIT' ? new Prisma.Decimal(-amount) : new Prisma.Decimal(amount);

      const newBalance = account.balance.plus(delta);

      if (newBalance.isNegative()) {
        throw new Error('INSUFFICIENT_FUNDS');
      }

      // 2. Create transaction as PENDING
      const transaction = await tx.transaction.create({
        data: {
          accountId,
          amount,
          status: 'PENDING',
          referenceId: idempotencyKey,
        },
      });

      try {
        // 3. Apply balance update
        await tx.account.update({
          where: { id: accountId },
          data: {
            balance: newBalance,
          },
        });

        // 4. Mark transaction SUCCESS
        return tx.transaction.update({
          where: { id: transaction.id },
          data: { status: 'SUCCESS' },
        });
      } catch (err) {
        // 5. Mark transaction FAILED
        await tx.transaction.update({
          where: { id: transaction.id },
          data: { status: 'FAILED' },
        });
        throw err;
      }
    });
  });
};
