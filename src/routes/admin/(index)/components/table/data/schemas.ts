import { z } from 'zod';

export const churchSchema = z.object({
  id: z.number(),
  created_at: z.string(),
  name: z.string(),
  description: z.string(),
  events: z.any(),
  photo_link: z.string(),
  address: z.string(),
  open_time: z.string(),
  close_time: z.string(),
  certs: z.any()
});

export type DashboardPageTable = z.output<typeof churchSchema>;
