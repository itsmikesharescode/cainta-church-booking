import { z } from 'zod';

export const paymentSchema = z.object({
  id: z.number(),
  created_at: z.string(),
  church_id: z.number(),
  reservation_id: z.number().nullable(),
  cert_request_id: z.number().nullable(),
  xendit_callback: z.any(),
  payment_channel: z.string(),
  price: z.number()
});

export type PaymentPageTable = z.output<typeof paymentSchema>;
