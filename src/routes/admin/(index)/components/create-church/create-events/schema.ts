import { z } from 'zod';

const eventSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().min(1, 'Must enter a price')
});

export const eventsSchema = z.array(eventSchema);

export type EventsSchema = typeof eventSchema;
