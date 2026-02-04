import prisma from '../../config/database.js';
import { Prisma } from '@prisma/client';

/**
 * Create an account for a user
 */
export const createAccount = async ({ userId, initialBalance }) => {
  const balance = initialBalance ?? '0.00';

  const account = await prisma.account.create({
    data: {
      userId,
      balance,
    },
    select: {
      id: true,
      balance: true,
      status: true,
      createdAt: true,
    },
  });

  return account;
};


/**
 * Get all accounts for a user
 */
export const getAccountsByUserId = async ({ userId, limit, offset }) => {
  const [accounts, total] = await prisma.$transaction([
    prisma.account.findMany({
      where: { userId },
      select: {
        id: true,
        balance: true,
        status: true,
        closedAt: true,
      },
      orderBy: { createdAt: 'asc' },
      take: limit,
      skip: offset,
    }),
    prisma.account.count({
      where: { userId },
    }),
  ]);

  return { accounts, total };
};

/**
 * Get a single account by accountId for a given user
 * Ownership enforced via composite filter
 */
export const getAccountByIdForUser = async ({ userId, accountId }) => {
  return prisma.account.findFirst({
    where: {
      id: accountId,
      userId,
    },
    select: {
      id: true,
      balance: true,
      status: true,
      closedAt: true,
    },
  });
};


/**
 * Close an account for a user
 * Rules:
 *  - Account must belong to user
 *  - Balance must be 0.00
 *  - No pending transactions
 */
export const closeAccountForUser = async ({ userId, accountId }) => {
  return prisma.$transaction(async (tx) => {
    const account = await tx.account.findFirst({
      where: {
        id: accountId,
        userId,
        status: 'ACTIVE',
      },
      select: {
        id: true,
        balance: true,
      },
    });

    if (!account) {
      return { error: 'NOT_FOUND' };
    }

    if (!account.balance.equals(new Prisma.Decimal('0.00'))) {
      return { error: 'NON_ZERO_BALANCE' };
    }

    const pendingTransactions = await tx.transaction.count({
      where: {
        accountId,
        status: 'PENDING',
      },
    });

    if (pendingTransactions > 0) {
      return { error: 'PENDING_TRANSACTIONS' };
    }

    await tx.account.update({
      where: { id: accountId },
      data: {
        status: 'CLOSED',
        closedAt: new Date(),
      },
    });

    return { success: true };
  });
};