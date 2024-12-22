import { z } from 'zod';

export const updatePasswordSchema = z
  .object({
    user_id: z.string(),
    password: z.string().min(8, { message: 'Must enter a strong password.' }),
    confirmPassword: z.string()
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'Must confirm password',
        path: ['confirmPassword']
      });
    }
  });

export type UpdatePasswordSchema = typeof updatePasswordSchema;
