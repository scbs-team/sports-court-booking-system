import { z } from "zod";

export const createBookingSchema = z.object({
  body: z.object({
    courtId: z.number().int().positive(),
    startTime: z.string().datetime(),
    endTime: z.string().datetime()
  })
});
