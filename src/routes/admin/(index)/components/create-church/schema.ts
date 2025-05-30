import { z } from 'zod';

export const createChurchSchema = z.object({
  image: z
    .instanceof(File, { message: 'Please upload a file.' })
    .refine((f) => f.size < 3_000_000, 'Max 3 MB upload size.'),
  name: z.string().min(1, { message: 'Must enter a church name.' }),
  description: z.string().min(1, { message: 'Must enter description.' }),
  events: z.string().min(1, { message: 'Must enter an event name.' }),
  certs: z.string().min(1, { message: 'Must enter a certificate.' }),
  address: z.string().min(1, { message: 'Must enter a church address.' }),
  open_time: z.string().min(1, { message: 'Must enter opening time.' }),
  close_time: z.string().min(1, { message: 'Must enter closing time.' })
});

export type CreateChurchSchema = typeof createChurchSchema;
