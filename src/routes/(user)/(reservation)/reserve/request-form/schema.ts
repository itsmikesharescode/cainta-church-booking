import { z } from 'zod';

export const requestSchema = z.object({
  date: z.string().min(1, { message: 'Must select date.' }),
  initial_time: z.string().min(1, { message: 'Must select initial time.' }),
  final_time: z.string().min(1, { message: 'Must select final time.' }),
  church_id: z.number(),
  name: z.string().min(1, { message: 'Must select certificate name.' })
});

export type RequestSchema = typeof requestSchema;
