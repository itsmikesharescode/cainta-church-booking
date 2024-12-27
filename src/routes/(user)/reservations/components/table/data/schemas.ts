import { z } from 'zod';

export const reservationSchema = z.object({
  id: z.number(),
  church_id: z.number(),
  created_at: z.string(),
  reference_id: z.string(),
  event_name: z.string(),
  number_of_guest: z.number(),
  date: z.string(),
  initial_time: z.string(),
  final_time: z.string(),
  price: z.number(),
  status: z.string(),
  message: z.string()
});

export type ReservationsPageTable = z.output<typeof reservationSchema>;
