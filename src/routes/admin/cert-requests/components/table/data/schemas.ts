import { z } from 'zod';
import type { Database } from '$lib/database.types';

type ChurchesTb = Database['public']['Tables']['churches_tb']['Row'];

export const adminCertRequestSchema = z.object({
  user_id: z.string(),
  id: z.number(),
  created_at: z.string(),
  reference_id: z.string(),
  name: z.string(),
  date: z.string(),
  initial_time: z.string(),
  final_time: z.string(),
  price: z.number().nullable(),
  status: z.string(),
  users_tb: z.any(),
  churches_tb: z.custom<ChurchesTb>()
});

export type AdminCertRequestsPageTable = z.output<typeof adminCertRequestSchema>;
