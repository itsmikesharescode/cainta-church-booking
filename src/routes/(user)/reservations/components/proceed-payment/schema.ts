import { z } from 'zod';
import type { ReservationsPageTable } from '../table/data/schemas';

export const proceedPaymentSchema = z.object({
  activeRow: z.custom<ReservationsPageTable>().nullable()
});

export type ProceedPaymentSchema = typeof proceedPaymentSchema;
