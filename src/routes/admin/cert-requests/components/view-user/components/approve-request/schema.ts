import { z } from 'zod';

export const adminApproveCertSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  price: z.number().refine((value) => value > 0, { message: 'Price must be greater than 0' }),
  date: z.string().min(1, { message: 'Must select date.' }),
  initial_time: z.string().min(1, { message: 'Must select initial time.' }),
  final_time: z.string().min(1, { message: 'Must select final time.' })
});

export type AdminApproveCertSchema = typeof adminApproveCertSchema;
