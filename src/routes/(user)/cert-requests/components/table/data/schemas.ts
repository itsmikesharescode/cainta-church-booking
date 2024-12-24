import { z } from 'zod';

export const certRequestSchema = z.object({
  user_id: z.string(),
  id: z.number(),
  created_at: z.string(),
  reference_id: z.string(),
  church_id: z.number(),
  name: z.string(),
  price: z.number().nullable(),
  date_available: z.string().nullable(),
  time_available_start: z.string().nullable(),
  time_available_end: z.string().nullable()
});

export type CertRequestsPageTable = z.output<typeof certRequestSchema>;
