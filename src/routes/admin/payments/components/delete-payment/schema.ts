import { z } from 'zod';

export const adminDeletePaymentSchema = z.object({
  id: z.number()
});

export type AdminDeletePaymentSchema = typeof adminDeletePaymentSchema;
