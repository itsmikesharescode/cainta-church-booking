import { z } from 'zod';

export const registerSchema = z
  .object({
    email: z.string().email({ message: 'Must enter a valid email.' }),
    firstname: z.string().min(1, { message: 'Must enter first name.' }),
    lastname: z.string().min(1, { message: 'Must enter last name.' }),
    mobile_number: z
      .string()
      .length(11, { message: 'Mobile number must be exactly 10 digits.' })
      .regex(/^\d+$/, { message: 'Mobile number must be numeric.' }),
    password: z.string().min(8, { message: 'Must enter a strong password,' }),
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

export type RegisterSchema = typeof registerSchema;
