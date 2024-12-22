import { z } from 'zod';

export const deleteAccountSchema = z.object({
  user_id: z.string(),
  image_path: z.string()
});

export type DeleteAccountSchema = typeof deleteAccountSchema;
