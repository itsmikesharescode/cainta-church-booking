import { z } from 'zod';

export const reservationSchema = z.object({
  id: z.number(),
  created_at: z.string(),
  reference_id: z.string(),
  event_name: z.string(),
  number_of_guest: z.string(),
  date: z.string(),
  initial_time: z.string(),
  final_time: z.string()
});

export type ReservationsPageTable = z.output<typeof reservationSchema>;
