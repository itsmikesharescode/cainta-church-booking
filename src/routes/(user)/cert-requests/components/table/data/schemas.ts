import { z } from 'zod';

export const certRequestSchema = z.object({
  id: z.number(),
  created_at: z.string(),
  reference_id: z.string(),
  church_id: z.number(),
  name: z.string(),
  price: z.string(),
  date_available: z.string(),
  time_available_start: z.string(),
  time_available_end: z.string()
});

export type CertRequestsPageTable = z.output<typeof certRequestSchema>;
