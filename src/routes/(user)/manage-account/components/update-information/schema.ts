import { z } from 'zod';

export const updateInformationSchema = z.object({
  firstname: z.string().min(1, { message: 'Must enter a first name.' }),
  lastname: z.string().min(1, { message: 'Must enter a middle name.' }),
  mobile_number: z
    .string()
    .length(11, { message: 'Mobile number must be exactly 11 digits.' })
    .regex(/^\d+$/, { message: 'Mobile number must be numeric.' })
});

export type UpdateInformationSchema = typeof updateInformationSchema;
