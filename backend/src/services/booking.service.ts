import { prisma } from "../lib/prisma";
import {
  BookingStatus,
  CreateBookingInput,
  GetBookingsFilters,
  UpdateBookingStatusInput,
  AvailabilityOptions,
  BookingStats,
  ValidatedTimeRange,
  PrismaWhereInput,
} from "../domain/booking/booking.types";

const BOOKING_CONFIG = {
  MAX_DURATION_HOURS: 2,
  MIN_DURATION_MINUTES: 30,
  BUFFER_MINUTES: 15,
  BUSINESS_HOURS: {
    OPEN: 8,
    CLOSE: 22,
  },
  MAX_ADVANCE_DAYS: 30,
  MIN_ADVANCE_MINUTES: 30,
} as const;

export class BookingServiceError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = "BookingServiceError";
  }
}

const validateAndParseTimeRange = (
  startTime: string | Date,
  endTime: string | Date
): ValidatedTimeRange => {
  const start = new Date(startTime);
  const end = new Date(endTime);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new BookingServiceError("Invalid date format");
  }

  if (end <= start) {
    throw new BookingServiceError("End time must be after start time", "INVALID_TIME_RANGE");
  }

  const durationMs = end.getTime() - start.getTime();
  const durationHours = durationMs / (1000 * 60 * 60);
  const durationMinutes = durationMs / (1000 * 60);

  if (durationHours > BOOKING_CONFIG.MAX_DURATION_HOURS) {
    throw new BookingServiceError(
      `Maximum booking duration is ${BOOKING_CONFIG.MAX_DURATION_HOURS} hours`,
      "MAX_DURATION_EXCEEDED",
      {
        maxDurationHours: BOOKING_CONFIG.MAX_DURATION_HOURS,
        requestedDuration: durationHours,
      }
    );
  }

  if (durationMinutes < BOOKING_CONFIG.MIN_DURATION_MINUTES) {
    throw new BookingServiceError(
      `Minimum booking duration is ${BOOKING_CONFIG.MIN_DURATION_MINUTES} minutes`,
      "MIN_DURATION_NOT_MET",
      {
        minDurationMinutes: BOOKING_CONFIG.MIN_DURATION_MINUTES,
        requestedDuration: durationMinutes,
      }
    );
  }

  const startHour = start.getHours() + start.getMinutes() / 60;
  const endHour = end.getHours() + end.getMinutes() / 60;

  if (startHour < BOOKING_CONFIG.BUSINESS_HOURS.OPEN) {
    throw new BookingServiceError(
      `Bookings start at ${BOOKING_CONFIG.BUSINESS_HOURS.OPEN}:00`,
      "OUTSIDE_BUSINESS_HOURS",
      { earliestStart: BOOKING_CONFIG.BUSINESS_HOURS.OPEN }
    );
  }

  if (endHour > BOOKING_CONFIG.BUSINESS_HOURS.CLOSE) {
    throw new BookingServiceError(
      `Bookings must end by ${BOOKING_CONFIG.BUSINESS_HOURS.CLOSE}:00`,
      "OUTSIDE_BUSINESS_HOURS",
      { latestEnd: BOOKING_CONFIG.BUSINESS_HOURS.CLOSE }
    );
  }

  if (start.toDateString() !== end.toDateString()) {
    throw new BookingServiceError("Cross-day bookings are not allowed", "CROSS_DAY_BOOKING");
  }

  const now = new Date();
  const maxAdvanceDate = new Date(now);
  maxAdvanceDate.setDate(now.getDate() + BOOKING_CONFIG.MAX_ADVANCE_DAYS);

  if (start > maxAdvanceDate) {
    throw new BookingServiceError(
      `Bookings can only be made up to ${BOOKING_CONFIG.MAX_ADVANCE_DAYS} days in advance`,
      "MAX_ADVANCE_EXCEEDED",
      { maxAdvanceDays: BOOKING_CONFIG.MAX_ADVANCE_DAYS }
    );
  }

  const minutesUntilStart = (start.getTime() - now.getTime()) / (1000 * 60);
  if (minutesUntilStart < BOOKING_CONFIG.MIN_ADVANCE_MINUTES) {
    throw new BookingServiceError(
      `Bookings must be made at least ${BOOKING_CONFIG.MIN_ADVANCE_MINUTES} minutes in advance`,
      "MIN_ADVANCE_NOT_MET",
      { minAdvanceMinutes: BOOKING_CONFIG.MIN_ADVANCE_MINUTES }
    );
  }

  return { start, end, durationHours, durationMinutes };
};

const checkBookingConflicts = async (
  courtId: number,
  start: Date,
  end: Date,
  excludeBookingId?: number
): Promise<{ hasConflict: boolean; conflictingBooking?: any; message?: string }> => {
  const overlapWhere: PrismaWhereInput = {
    courtId,
    status: {
      in: [BookingStatus.PENDING, BookingStatus.CONFIRMED],
    },
    ...(excludeBookingId && {
      id: { not: excludeBookingId },
    }),
    AND: [{ startTime: { lt: end } }, { endTime: { gt: start } }],
  };

  const overlappingBooking = await prisma.booking.findFirst({
    where: overlapWhere as any,
    include: {
      court: true,
      user: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
    },
  });

  if (overlappingBooking) {
    return {
      hasConflict: true,
      conflictingBooking: overlappingBooking,
      message: "Time slot already booked",
    };
  }

  const bufferStart = new Date(start.getTime() - BOOKING_CONFIG.BUFFER_MINUTES * 60000);
  const bufferEnd = new Date(end.getTime() + BOOKING_CONFIG.BUFFER_MINUTES * 60000);

  const bufferWhere: PrismaWhereInput = {
    courtId,
    status: BookingStatus.CONFIRMED,
    AND: [{ startTime: { lt: bufferEnd } }, { endTime: { gt: bufferStart } }],
  };

  if (excludeBookingId) {
    bufferWhere.id = { not: excludeBookingId };
  }

  const bufferOverlap = await prisma.booking.findFirst({
    where: bufferWhere as any,
    include: {
      user: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });

  if (bufferOverlap) {
    return {
      hasConflict: true,
      conflictingBooking: bufferOverlap,
      message: `Need ${BOOKING_CONFIG.BUFFER_MINUTES} minutes buffer between confirmed bookings`,
    };
  }

  return { hasConflict: false };
};

export const createBooking = async (data: CreateBookingInput & { userId: string }) => {
  try {
    const { start, end } = validateAndParseTimeRange(data.startTime, data.endTime);

    const court = await prisma.court.findUnique({
      where: { id: data.courtId },
    });

    if (!court) {
      throw new BookingServiceError("Court not found", "COURT_NOT_FOUND");
    }

    const conflictCheck = await checkBookingConflicts(data.courtId, start, end);

    if (conflictCheck.hasConflict) {
      throw new BookingServiceError(
        conflictCheck.message || "Booking conflict detected",
        "BOOKING_CONFLICT",
        { conflictingBooking: conflictCheck.conflictingBooking }
      );
    }

    const booking = await prisma.$transaction(async (tx) => {
      return tx.booking.create({
        data: {
          userId: data.userId,
          courtId: data.courtId,
          startTime: start,
          endTime: end,
          status: BookingStatus.CONFIRMED,
        },
        include: {
          court: true,
          user: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
        },
      });
    });

    return booking;
  } catch (error) {
    if (error instanceof BookingServiceError) {
      throw error;
    }
    throw new BookingServiceError(
      error instanceof Error ? error.message : "Failed to create booking",
      "CREATE_BOOKING_FAILED"
    );
  }
};

export const getBookings = async (filters: GetBookingsFilters = {}): Promise<any[]> => {
  try {
    const where: PrismaWhereInput = {};

    if (filters.courtId) {
      where.courtId = filters.courtId;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.fromDate || filters.toDate) {
      where.startTime = {};
      if (filters.fromDate) (where.startTime as any).gte = filters.fromDate;
      if (filters.toDate) (where.startTime as any).lte = filters.toDate;
    }

    if (filters.userId) {
      where.userId = filters.userId;
    }

    const bookings = await prisma.booking.findMany({
      where: where as any,
      include: {
        court: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
      orderBy: { startTime: "asc" },
    });

    return bookings;
  } catch (error) {
    throw new BookingServiceError(
      error instanceof Error ? error.message : "Failed to fetch bookings",
      "FETCH_BOOKINGS_FAILED"
    );
  }
};

export const getAvailableCourts = async (
  startTime: string,
  endTime: string,
  options?: AvailabilityOptions
): Promise<any[]> => {
  try {
    const { start, end } = validateAndParseTimeRange(startTime, endTime);

    const conflictingBookings = await prisma.booking.findMany({
      where: {
        status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] } as any,
        AND: [{ startTime: { lt: end } } as any, { endTime: { gt: start } } as any],
      },
      select: { courtId: true },
    });

    const bookedCourtIds = conflictingBookings.map((b) => b.courtId);

    const where: any = {};

    if (options?.includeCourtIds?.length) {
      const availableIncluded = options.includeCourtIds.filter(
        (id) => !bookedCourtIds.includes(id)
      );

      if (availableIncluded.length === 0) {
        return [];
      }

      where.id = { in: availableIncluded };
    } else {
      const excludedIds = [...bookedCourtIds];

      if (options?.excludeCourtIds?.length) {
        excludedIds.push(...options.excludeCourtIds);
      }

      where.id = { notIn: excludedIds };
    }

    const availableCourts = await prisma.court.findMany({
      where,
      include: {
        _count: {
          select: { bookings: true },
        },
      },
    });

    return availableCourts;
  } catch (error) {
    if (error instanceof BookingServiceError) {
      throw error;
    }
    throw new BookingServiceError(
      error instanceof Error ? error.message : "Failed to fetch available courts",
      "FETCH_AVAILABLE_COURTS_FAILED"
    );
  }
};

export const updateBookingStatus = async (
  input: UpdateBookingStatusInput & { userId?: string }
): Promise<any> => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: input.bookingId },
      include: { user: true },
    });

    if (!booking) {
      throw new BookingServiceError("Booking not found", "BOOKING_NOT_FOUND");
    }

    if (input.userId && booking.userId !== input.userId) {
      throw new BookingServiceError("Unauthorized to update this booking", "UNAUTHORIZED");
    }

    const validTransitions: Record<BookingStatus, BookingStatus[]> = {
      [BookingStatus.PENDING]: [BookingStatus.CONFIRMED, BookingStatus.CANCELLED],
      [BookingStatus.CONFIRMED]: [BookingStatus.CANCELLED, BookingStatus.COMPLETED],
      [BookingStatus.CANCELLED]: [],
      [BookingStatus.COMPLETED]: [],
    };

    const allowedTransitions = validTransitions[booking.status as BookingStatus];

    if (!allowedTransitions.includes(input.newStatus)) {
      throw new BookingServiceError(
        `Invalid status transition from ${booking.status} to ${input.newStatus}`,
        "INVALID_STATUS_TRANSITION",
        { currentStatus: booking.status, newStatus: input.newStatus }
      );
    }

    if (input.currentStatus && booking.status !== input.currentStatus) {
      throw new BookingServiceError(
        `Booking status has changed from ${input.currentStatus} to ${booking.status}`,
        "CONCURRENCY_CONFLICT",
        { expectedStatus: input.currentStatus, actualStatus: booking.status }
      );
    }

    if (input.newStatus === BookingStatus.CANCELLED) {
      const now = new Date();
      const hoursUntilStart = (booking.startTime.getTime() - now.getTime()) / (1000 * 60 * 60);

      if (hoursUntilStart < 2) {
        throw new BookingServiceError(
          "Cannot cancel booking less than 2 hours before start time",
          "CANCELLATION_TOO_LATE",
          { hoursUntilStart }
        );
      }
    }

    if (input.newStatus === BookingStatus.COMPLETED) {
      const now = new Date();
      if (now < booking.endTime) {
        throw new BookingServiceError(
          "Cannot complete booking before end time",
          "COMPLETION_TOO_EARLY"
        );
      }
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: input.bookingId },
      data: {
        status: input.newStatus,
        updatedAt: new Date(),
      },
      include: {
        court: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    return updatedBooking;
  } catch (error) {
    if (error instanceof BookingServiceError) {
      throw error;
    }
    throw new BookingServiceError(
      error instanceof Error ? error.message : "Failed to update booking status",
      "UPDATE_STATUS_FAILED"
    );
  }
};

export const checkCourtAvailability = async (
  courtId: number,
  startTime: string,
  endTime: string,
  excludeBookingId?: number
): Promise<{
  available: boolean;
  conflict?: any;
  message?: string;
  suggestedTimes?: Array<{ start: Date; end: Date }>;
}> => {
  try {
    const { start, end } = validateAndParseTimeRange(startTime, endTime);

    const court = await prisma.court.findUnique({
      where: { id: courtId },
    });

    if (!court) {
      throw new BookingServiceError("Court not found", "COURT_NOT_FOUND");
    }

    const conflictCheck = await checkBookingConflicts(courtId, start, end, excludeBookingId);

    if (!conflictCheck.hasConflict) {
      return { available: true };
    }

    const suggestedTimes: Array<{ start: Date; end: Date }> = [];
    const searchWindowHours = 4;

    for (let hourOffset = -searchWindowHours; hourOffset <= searchWindowHours; hourOffset += 0.5) {
      if (hourOffset === 0) continue;

      const suggestedStart = new Date(start.getTime() + hourOffset * 60 * 60 * 1000);
      const suggestedEnd = new Date(end.getTime() + hourOffset * 60 * 60 * 1000);

      try {
        const suggestedConflictCheck = await checkBookingConflicts(
          courtId,
          suggestedStart,
          suggestedEnd,
          excludeBookingId
        );

        if (!suggestedConflictCheck.hasConflict) {
          suggestedTimes.push({ start: suggestedStart, end: suggestedEnd });
          if (suggestedTimes.length >= 3) break;
        }
      } catch {
        continue;
      }
    }

    return {
      available: false,
      conflict: conflictCheck.conflictingBooking,
      message: conflictCheck.message,
      suggestedTimes: suggestedTimes.length > 0 ? suggestedTimes : undefined,
    };
  } catch (error) {
    if (error instanceof BookingServiceError) {
      throw error;
    }
    throw new BookingServiceError(
      error instanceof Error ? error.message : "Failed to check availability",
      "CHECK_AVAILABILITY_FAILED"
    );
  }
};

export const getBookingById = async (id: number): Promise<any> => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        court: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    if (!booking) {
      throw new BookingServiceError("Booking not found", "BOOKING_NOT_FOUND");
    }

    return booking;
  } catch (error) {
    if (error instanceof BookingServiceError) {
      throw error;
    }
    throw new BookingServiceError(
      error instanceof Error ? error.message : "Failed to fetch booking",
      "FETCH_BOOKING_FAILED"
    );
  }
};

export const deleteBooking = async (id: number, userId?: string): Promise<void> => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      throw new BookingServiceError("Booking not found", "BOOKING_NOT_FOUND");
    }

    if (userId && booking.userId !== userId) {
      throw new BookingServiceError("Unauthorized to delete this booking", "UNAUTHORIZED");
    }

    const now = new Date();
    if (booking.startTime <= now) {
      throw new BookingServiceError("Cannot delete booking that has already started", "DELETE_NOT_ALLOWED");
    }

    await prisma.booking.delete({
      where: { id },
    });
  } catch (error) {
    if (error instanceof BookingServiceError) {
      throw error;
    }
    throw new BookingServiceError(
      error instanceof Error ? error.message : "Failed to delete booking",
      "DELETE_BOOKING_FAILED"
    );
  }
};

export const getBookingStats = async (
  courtId?: number,
  startDate?: Date,
  endDate?: Date
): Promise<BookingStats> => {
  try {
    const where: any = {};

    if (courtId) {
      where.courtId = courtId;
    }

    if (startDate || endDate) {
      where.startTime = {};
      if (startDate) where.startTime.gte = startDate;
      if (endDate) where.startTime.lte = endDate;
    }

    const allBookings = await prisma.booking.findMany({
      where,
      select: {
        status: true,
      },
    });

    const statusCounts: Record<string, number> = {};
    let total = 0;

    allBookings.forEach((booking) => {
      statusCounts[booking.status] = (statusCounts[booking.status] || 0) + 1;
      total++;
    });

    return {
      total,
      byStatus: statusCounts,
    };
  } catch (error) {
    throw new BookingServiceError(
      error instanceof Error ? error.message : "Failed to fetch booking stats",
      "FETCH_STATS_FAILED"
    );
  }
};

export const autoCompletePastBookings = async (): Promise<{ completed: number }> => {
  try {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    const result = await prisma.booking.updateMany({
      where: {
        status: BookingStatus.CONFIRMED,
        endTime: { lt: oneHourAgo },
      },
      data: {
        status: BookingStatus.COMPLETED,
        updatedAt: new Date(),
      },
    });

    return { completed: result.count };
  } catch (error) {
    throw new BookingServiceError(
      error instanceof Error ? error.message : "Failed to auto-complete bookings",
      "AUTO_COMPLETE_FAILED"
    );
  }
};

export { BookingStatus };
