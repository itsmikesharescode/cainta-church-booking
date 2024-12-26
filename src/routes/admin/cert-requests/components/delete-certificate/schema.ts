import { z } from 'zod';

export const adminDeleteCertSchema = z.object({
  id: z.number()
});

export type AdminDeleteCertSchema = typeof adminDeleteCertSchema;
