import { z } from 'zod';

export const adminApproveResSchema = z.object({
  price: z.number().refine((value) => value > 0, { message: 'Price must be greater than 0' })
});

export type AdminApproveResSchema = typeof adminApproveResSchema;
