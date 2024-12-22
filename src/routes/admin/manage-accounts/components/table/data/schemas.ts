import { z } from 'zod';

export const accountSchema = z.object({
  user_id: z.string(),
  created_at: z.string(),
  user_meta_data: z.any(),
  email: z.string(),
  fullname: z.string(),
  mobile_number: z.string()
});

export type ManageAccountPageTable = z.output<typeof accountSchema>;
