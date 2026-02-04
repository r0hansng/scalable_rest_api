import { z } from 'zod';

export const createTransactionSchema = z.object({
  params: z.object({
    accountId: z.string().uuid(),
  }),
  body: z.object({
    amount: z.number().positive(),
    type: z.enum(['DEBIT', 'CREDIT']),
    idempotencyKey: z.string().min(1),
  }),
});
