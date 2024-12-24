import { z } from 'zod';

export const adminReservationSchema = z.object({
  user_id: z.string(),
  id: z.number(),
  created_at: z.string(),
  reference_id: z.string(),
  event_name: z.string(),
  number_of_guest: z.number(),
  date: z.string(),
  initial_time: z.string(),
  final_time: z.string(),
  price: z.number().nullable(),
  status: z.string(),
  message: z.string(),
  users_tb: z.any()
});

export type AdminReservationsPageTable = z.output<typeof adminReservationSchema>;
