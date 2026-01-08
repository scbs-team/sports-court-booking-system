import { z } from "zod";

// Booking status enum for validation
const BookingStatusEnum = z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"]);

export const createBookingSchema = z.object({
  body: z.object({
    courtId: z.string().uuid({ message: "Invalid court ID format" }),
    startTime: z.string().datetime({ message: "Invalid start time format" }),
    endTime: z.string().datetime({ message: "Invalid end time format" })
  })
});

export const updateBookingStatusSchema = z.object({
  body: z.object({
    status: BookingStatusEnum
  }),
  params: z.object({
    id: z.string().uuid({ message: "Invalid booking ID format" })
  })
});

export const getBookingsSchema = z.object({
  query: z.object({
    courtId: z.string().uuid({ message: "Invalid court ID format" }).optional(),
    status: BookingStatusEnum.optional(),
    fromDate: z.string().datetime({ message: "Invalid from date format" }).optional(),
    toDate: z.string().datetime({ message: "Invalid to date format" }).optional()
  })
});

export const checkAvailabilitySchema = z.object({
  params: z.object({
    courtId: z.string().uuid({ message: "Invalid court ID format" })
  }),
  query: z.object({
    startTime: z.string().datetime({ message: "Invalid start time format" }),
    endTime: z.string().datetime({ message: "Invalid end time format" }),
    excludeBookingId: z.string().uuid({ message: "Invalid booking ID format" }).optional()
  })
});
