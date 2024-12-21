import { z } from 'zod';

export const updateProfileSchema = z.object({
  image: z
    .instanceof(File, { message: 'Please upload a file.' })
    .refine((f) => f.size < 3_000_000, 'Max 3 MB upload size.')
});

export type UpdateProfileSchema = typeof updateProfileSchema;
