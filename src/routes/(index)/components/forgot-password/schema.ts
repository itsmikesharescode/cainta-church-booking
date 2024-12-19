import { z } from 'zod';

export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Must enter a valid email.' })
});

export type ForgotPasswordSchema = typeof forgotPasswordSchema;
