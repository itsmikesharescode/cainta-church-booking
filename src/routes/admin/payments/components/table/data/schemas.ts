import type { XenditCallback } from '$lib/types';
import { z } from 'zod';

export const adminPaymentSchema = z.object({
  id: z.number(),
  user_id: z.string(),
  church_id: z.number(),
  reservation_id: z.number().nullable(),
  cert_request_id: z.number().nullable(),
  reference_id: z.string(),
  created_at: z.string(),
  xendit_callback: z.custom<XenditCallback>(),
  payment_channel: z.string(),
  price: z.number(),
  type: z.string()
});

export type AdminPaymentPageTable = z.output<typeof adminPaymentSchema>;
