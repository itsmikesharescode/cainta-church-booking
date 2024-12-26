import { z } from 'zod';

export const adminApproveCertSchema = z.object({
  id: z.number(),
  price: z.number().refine((value) => value > 0, { message: 'Price must be greater than 0' })
});

export type AdminApproveCertSchema = typeof adminApproveCertSchema;
