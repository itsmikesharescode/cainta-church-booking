import { z } from 'zod';

export const certRequestSchema = z.object({
  user_id: z.string(),
  id: z.number(),
  created_at: z.string(),
  reference_id: z.string(),
  church_id: z.number(),
  name: z.string(),
  price: z.number().nullable(),
  status: z.string(),
  date: z.string(),
  initial_time: z.string(),
  final_time: z.string()
});

export type CertRequestsPageTable = z.output<typeof certRequestSchema>;
