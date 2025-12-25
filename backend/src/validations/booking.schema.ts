import { z } from "zod";

export const bookingSchema = z.object({
  courtId: z.number(),
  startTime: z.string(),
  endTime: z.string()
});
