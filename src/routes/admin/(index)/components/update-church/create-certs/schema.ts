import { z } from 'zod';

const certificateSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Name is required'),
  price: z.number().min(1, 'Must enter a price')
});

export const certificatesSchema = z.array(certificateSchema);

export type CertificatesSchema = typeof certificateSchema;
