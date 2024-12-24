import { z } from 'zod';

export const adminDeleteReservationSchema = z.object({
  id: z.number()
});

export type AdminDeleteReservationSchema = typeof adminDeleteReservationSchema;
