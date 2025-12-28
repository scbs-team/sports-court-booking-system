import { z } from 'zod';

export const createBookingSchema = z.object({
  courtId: z.number().int().positive(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
});

export const bookingIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});
