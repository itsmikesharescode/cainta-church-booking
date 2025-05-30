import { z } from 'zod';

export const updateEmailSchema = z.object({
  user_id: z.string(),
  email: z.string().email({ message: 'Must enter a valid email.' })
});

export type UpdateEmailSchema = typeof updateEmailSchema;
