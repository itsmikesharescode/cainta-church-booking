import { z } from 'zod';
import type { CertRequestsPageTable } from '../table/data/schemas';

export const proceedPaymentSchema = z.object({
  activeRow: z.custom<CertRequestsPageTable>().nullable()
});

export type ProceedPaymentSchema = typeof proceedPaymentSchema;
