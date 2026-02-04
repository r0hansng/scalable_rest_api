import { z } from 'zod';

export const createAccountSchema = z.object({
  initialBalance: z.number().nonnegative().optional(),
});
