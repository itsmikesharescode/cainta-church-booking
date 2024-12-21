import { z } from 'zod';

export const paymentSchema = z.object({
  id: z.number(),
  created_at: z.string(),
  reference_id: z.string(),
  church_id: z.number(),
  reservation_id: z.number(),
  xendit_callback: z.any()
});

export type PaymentPageTable = z.output<typeof paymentSchema>;
