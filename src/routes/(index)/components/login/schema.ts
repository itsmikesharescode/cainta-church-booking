import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: 'Must enter a valid email.' }),
  password: z.string().min(1, { message: 'Must enter a password.' })
});

export type LoginSchema = typeof loginSchema;
