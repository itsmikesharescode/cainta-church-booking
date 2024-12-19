import { z } from 'zod';

export const updatePasswordSchema = z
  .object({
    password: z.string().min(8, { message: 'Must choose a strong password.' }),
    confirmPassword: z.string()
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'Must confirm password.',
        path: ['confirmPassword']
      });
    }
  });

export type UpdatePasswordSchema = typeof updatePasswordSchema;
