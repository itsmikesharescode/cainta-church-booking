import { z } from 'zod';

export const deletePaymentSchema = z.object({
  id: z.number()
});

export type DeletePaymentSchema = typeof deletePaymentSchema;
