import { z } from 'zod';

export const deleteChurchSchema = z.object({
  id: z.number(),
  image_path: z.string()
});

export type DeleteChurchSchema = typeof deleteChurchSchema;
