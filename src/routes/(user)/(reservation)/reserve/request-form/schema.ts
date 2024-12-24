import { z } from 'zod';

export const requestSchema = z.object({
  church_id: z.number(),
  name: z.string().min(1, { message: 'Must select certificate name.' })
});

export type RequestSchema = typeof requestSchema;
