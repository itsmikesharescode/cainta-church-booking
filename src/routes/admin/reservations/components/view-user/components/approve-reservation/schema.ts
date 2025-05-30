import { z } from 'zod';

export const adminApproveResSchema = z.object({
  id: z.number(),
  price: z.number().refine((value) => value > 0, { message: 'Price must be greater than 0' }),
  email: z.string().email()
});

export type AdminApproveResSchema = typeof adminApproveResSchema;
