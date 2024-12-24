import { z } from 'zod';

export const cancelReservationSchema = z.object({
  id: z.number()
});

export type CancelReservationSchema = typeof cancelReservationSchema;
