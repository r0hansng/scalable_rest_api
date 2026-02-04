import { PrismaClient } from '@prisma/client';
import logger from '../config/logger.js';

const prisma = new PrismaClient();

/**
 * Check if an idempotency key exists and return the transaction if it does
 * @param {string} key - Unique idempotency key from client request
 * @returns {object|null} - Existing transaction or null
 */
export async function getTransactionByIdempotencyKey(key) {
  try {
    const record = await prisma.idempotencyKey.findUnique({
      where: { key },
      include: { transaction: true },
    });

    return record ? record.transaction : null;
  } catch (err) {
    logger.error('Error fetching idempotency key', err);
    throw err;
  }
}

/**
 * Create a new idempotency key for a transaction
 * @param {string} key - Unique key
 * @param {string} transactionId - Transaction associated with this key
 * @returns {object} - Created idempotency key record
 */
export async function createIdempotencyKey(key, transactionId) {
  try {
    const record = await prisma.idempotencyKey.create({
      data: {
        key,
        transactionId,
      },
    });

    return record;
  } catch (err) {
    logger.error('Error creating idempotency key', err);
    throw err;
  }
}

/**
 * Ensure a transaction is processed idempotently
 * @param {string} key
 * @param {function} transactionFn - Function that creates the transaction
 */
export async function processIdempotentTransaction(key, transactionFn) {
  try {
    const existingTransaction = await getTransactionByIdempotencyKey(key);

    if (existingTransaction) {
      logger.info(`Transaction already exists for idempotency key: ${key}`);
      return existingTransaction;
    }

    const transaction = await transactionFn();

    await createIdempotencyKey(key, transaction.id);

    return transaction;
  } catch (err) {
    logger.error('Error processing idempotent transaction', err);
    throw err;
  }
}
