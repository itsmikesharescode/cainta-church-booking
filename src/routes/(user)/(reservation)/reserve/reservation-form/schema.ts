import { z } from 'zod';

export const reservationSchema = z.object({
  church_id: z.number(),
  event_name: z.string().min(1, { message: 'Must choose event name.' }),
  number_of_guest: z.number().min(1, { message: 'Must enter number of guest' }),
  date: z.string().min(1, { message: 'Must select date.' }),
  initial_time: z.string().min(1, { message: 'Must enter initial time.' }),
  final_time: z.string().min(1, { message: 'Must enter final time.' }),
  message: z.string().min(1, { message: 'Must enter a message.' })
});

export type ReservationSchema = typeof reservationSchema;
