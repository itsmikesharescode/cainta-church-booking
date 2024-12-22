import { z } from 'zod';

export const updateInfoSchema = z.object({
  user_id: z.string(),
  firstname: z.string().min(1, { message: 'Must enter a new first name.' }),
  lastname: z.string().min(1, { message: 'Must enter a new last name.' }),
  mobile_number: z
    .string()
    .length(11, { message: 'Mobile number must be exactly 10 digits.' })
    .regex(/^\d+$/, { message: 'Mobile number must be numeric.' })
});

export type UpdateInfoSchema = typeof updateInfoSchema;
