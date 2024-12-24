import { z } from 'zod';

export const cancelRequestSchema = z.object({
  id: z.number()
});

export type CancelRequestSchema = typeof cancelRequestSchema;
