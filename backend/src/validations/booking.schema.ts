import { z } from 'zod';

const BookingStatusEnum = z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']);

// Helper for ISO date-time validation
const isoDateTime = z.string().refine((val) => {
  const date = new Date(val);
  return !isNaN(date.getTime());
}, {
  message: 'Must be a valid ISO date-time string',
});

// Helper for date validation (YYYY-MM-DD format)
const dateString = z.string().refine((val) => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(val)) return false;
  
  const date = new Date(val);
  return !isNaN(date.getTime()) && date.toISOString().startsWith(val);
}, {
  message: 'Must be a valid date in YYYY-MM-DD format',
});

export const createBookingSchema = z.object({
  body: z.object({
    courtId: z.coerce.number().int().positive(),
    startTime: isoDateTime,
    endTime: isoDateTime,
  })
  .refine((data) => {
    const start = new Date(data.startTime);
    const end = new Date(data.endTime);
    return end > start;
  }, {
    message: 'End time must be after start time',
    path: ['endTime'],
  }),
});

export const updateBookingStatusSchema = z.object({
  body: z.object({
    status: BookingStatusEnum,
  }),
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
});

export const getBookingsSchema = z.object({
  query: z.object({
    courtId: z.coerce.number().int().positive().optional(),
    status: BookingStatusEnum.optional(),
    fromDate: isoDateTime.optional(),
    toDate: isoDateTime.optional(),
    userId: z.string().uuid({ message: 'Invalid user ID format' }).optional(),
  })
  .refine((data) => {
    if (data.fromDate && data.toDate) {
      const from = new Date(data.fromDate);
      const to = new Date(data.toDate);
      return to >= from;
    }
    return true;
  }, {
    message: 'toDate must be after or equal to fromDate',
    path: ['toDate'],
  }),
});

export const checkAvailabilitySchema = z.object({
  params: z.object({
    courtId: z.coerce.number().int().positive(),
  }),
  query: z.object({
    startTime: isoDateTime,
    endTime: isoDateTime,
    excludeBookingId: z.coerce.number().int().positive().optional(),
  })
  .refine((data) => {
    const start = new Date(data.startTime);
    const end = new Date(data.endTime);
    return end > start;
  }, {
    message: 'End time must be after start time',
    path: ['endTime'],
  }),
});

export const deleteBookingSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
});

export const getBookingStatsSchema = z.object({
  query: z.object({
    courtId: z.coerce.number().int().positive().optional(),
    startDate: dateString.optional(),
    endDate: dateString.optional(),
  })
  .refine((data) => {
    if (data.startDate && data.endDate) {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return end >= start;
    }
    return true;
  }, {
    message: 'endDate must be after or equal to startDate',
    path: ['endDate'],
  }),
});
