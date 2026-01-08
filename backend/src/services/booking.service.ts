import prisma from "../lib/prisma";

// Configuration
const BOOKING_CONFIG = {
  MAX_DURATION_HOURS: 2,
  MIN_DURATION_MINUTES: 30,
  BUFFER_MINUTES: 15,
  BUSINESS_HOURS: {
    OPEN: 8,
    CLOSE: 22,
  }
} as const;

// Define BookingStatus locally to avoid import issues
const BookingStatus = {
  PENDING: "PENDING" as const,
  CONFIRMED: "CONFIRMED" as const,
  CANCELLED: "CANCELLED" as const,
  COMPLETED: "COMPLETED" as const
};

type BookingStatusType = typeof BookingStatus[keyof typeof BookingStatus];

interface CreateBookingInput {
  courtId: string;
  startTime: string;
  endTime: string;
}

interface GetBookingsFilters {
  courtId?: string;
  status?: BookingStatusType;
  fromDate?: Date;
  toDate?: Date;
  userId?: string;
}

interface UpdateBookingStatusInput {
  bookingId: string;
  newStatus: BookingStatusType;
  currentStatus?: BookingStatusType;
}

interface ConflictCheckResult {
  hasConflict: boolean;
  conflictingBooking?: any;
  message?: string;
}

// Validate booking times
const validateBookingTimes = (start: Date, end: Date): void => {
  if (end <= start) {
    throw new Error("End time must be after start time");
  }

  const durationMs = end.getTime() - start.getTime();
  const durationHours = durationMs / (1000 * 60 * 60);
  const durationMinutes = durationMs / (1000 * 60);

  if (durationHours > BOOKING_CONFIG.MAX_DURATION_HOURS) {
    throw new Error(`Maximum booking duration is ${BOOKING_CONFIG.MAX_DURATION_HOURS} hours`);
  }

  if (durationMinutes < BOOKING_CONFIG.MIN_DURATION_MINUTES) {
    throw new Error(`Minimum booking duration is ${BOOKING_CONFIG.MIN_DURATION_MINUTES} minutes`);
  }

  const startHour = start.getHours();
  const endHour = end.getHours();

  if (startHour < BOOKING_CONFIG.BUSINESS_HOURS.OPEN || 
      endHour > BOOKING_CONFIG.BUSINESS_HOURS.CLOSE) {
    throw new Error(
      `Bookings only allowed between ${BOOKING_CONFIG.BUSINESS_HOURS.OPEN}:00 and ${BOOKING_CONFIG.BUSINESS_HOURS.CLOSE}:00`
    );
  }

  if (start.toDateString() !== end.toDateString()) {
    throw new Error("Cross-day bookings are not allowed");
  }
};

// Check for booking conflicts
const checkBookingConflicts = async (
  courtId: string,
  start: Date,
  end: Date,
  excludeBookingId?: string
): Promise<ConflictCheckResult> => {
  
  // Build where clause for overlap check
  const overlapWhere: any = {
    courtId: courtId,
    status: {
      in: [BookingStatus.PENDING, BookingStatus.CONFIRMED]
    },
    AND: [
      { startTime: { lt: end } },
      { endTime: { gt: start } },
    ]
  };

  // Exclude specific booking for updates
  if (excludeBookingId) {
    overlapWhere.id = { not: excludeBookingId };
  }

  const overlappingBooking = await prisma.booking.findFirst({
    where: overlapWhere,
    include: { court: true },
  });

  if (overlappingBooking) {
    return {
      hasConflict: true,
      conflictingBooking: overlappingBooking,
      message: "Time slot already booked"
    };
  }

  // Check buffer time
  const bufferStart = new Date(start.getTime() - BOOKING_CONFIG.BUFFER_MINUTES * 60000);
  const bufferEnd = new Date(end.getTime() + BOOKING_CONFIG.BUFFER_MINUTES * 60000);

  const bufferWhere: any = {
    courtId: courtId,
    status: BookingStatus.CONFIRMED,
    AND: [
      { startTime: { lt: bufferEnd } },
      { endTime: { gt: bufferStart } },
    ]
  };

  if (excludeBookingId) {
    bufferWhere.id = { not: excludeBookingId };
  }

  const bufferOverlap = await prisma.booking.findFirst({
    where: bufferWhere,
  });

  if (bufferOverlap) {
    return {
      hasConflict: true,
      conflictingBooking: bufferOverlap,
      message: `Need ${BOOKING_CONFIG.BUFFER_MINUTES} minutes buffer between confirmed bookings`
    };
  }

  return { hasConflict: false };
};

// Create booking
export const createBooking = async (data: CreateBookingInput) => {
  const start = new Date(data.startTime);
  const end = new Date(data.endTime);

  validateBookingTimes(start, end);

  // Check court exists
  const court = await prisma.court.findUnique({
    where: { id: data.courtId },
  });

  if (!court) {
    throw new Error("Court not found");
  }

  // Check conflicts
  const conflictCheck = await checkBookingConflicts(data.courtId, start, end);
  
  if (conflictCheck.hasConflict) {
    throw new Error(conflictCheck.message || "Booking conflict detected");
  }

  // Create booking
  return prisma.booking.create({
    data: {
      courtId: data.courtId,
      startTime: start,
      endTime: end,
      status: BookingStatus.CONFIRMED,
    },
    include: { court: true },
  });
};

// Get bookings with filters
export const getBookings = async (filters: GetBookingsFilters = {}) => {
  const where: any = {};

  if (filters.courtId) {
    where.courtId = filters.courtId;
  }

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.fromDate || filters.toDate) {
    where.startTime = {};
    if (filters.fromDate) where.startTime.gte = filters.fromDate;
    if (filters.toDate) where.startTime.lte = filters.toDate;
  }

  if (filters.userId) {
    where.userId = filters.userId;
  }

  return prisma.booking.findMany({
    where,
    include: { court: true },
    orderBy: { startTime: 'asc' },
  });
};

// Get available courts
export const getAvailableCourts = async (
  startTime: string,
  endTime: string,
  options?: {
    excludeCourtIds?: string[];
    includeCourtIds?: string[];
  }
) => {
  const start = new Date(startTime);
  const end = new Date(endTime);

  validateBookingTimes(start, end);

  // Find courts with conflicts
  const conflictingBookings = await prisma.booking.findMany({
    where: {
      status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
      AND: [
        { startTime: { lt: end } },
        { endTime: { gt: start } },
      ],
    },
    select: { courtId: true },
  });

  const bookedCourtIds = conflictingBookings.map((b: { courtId: string }) => b.courtId);
  
  // Build court query
  const where: any = {};

  if (options?.includeCourtIds?.length) {
    // Filter to only included courts
    const availableIncluded = options.includeCourtIds.filter(
      (id: string) => !bookedCourtIds.includes(id)
    );
    
    if (availableIncluded.length === 0) {
      return [];
    }
    
    where.id = { in: availableIncluded };
  } else {
    // Exclude booked courts
    const excludedIds = [...bookedCourtIds];
    
    if (options?.excludeCourtIds?.length) {
      excludedIds.push(...options.excludeCourtIds);
    }
    
    where.id = { notIn: excludedIds };
  }

  return prisma.court.findMany({ where });
};

// Update booking status
export const updateBookingStatus = async (
  input: UpdateBookingStatusInput
) => {
  // Get current booking
  const booking = await prisma.booking.findUnique({
    where: { id: input.bookingId },
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  // Validate status transition
  const validTransitions: Record<BookingStatusType, BookingStatusType[]> = {
    [BookingStatus.PENDING]: [BookingStatus.CONFIRMED, BookingStatus.CANCELLED],
    [BookingStatus.CONFIRMED]: [BookingStatus.CANCELLED, BookingStatus.COMPLETED],
    [BookingStatus.CANCELLED]: [],
    [BookingStatus.COMPLETED]: [],
  };

  const allowedTransitions = validTransitions[booking.status as BookingStatusType];
  
  if (!allowedTransitions.includes(input.newStatus)) {
    throw new Error(
      `Invalid status transition from ${booking.status} to ${input.newStatus}`
    );
  }

  // Concurrency check
  if (input.currentStatus && booking.status !== input.currentStatus) {
    throw new Error(
      `Booking status has changed from ${input.currentStatus} to ${booking.status}`
    );
  }

  // Cancellation rules
  if (input.newStatus === BookingStatus.CANCELLED) {
    const now = new Date();
    const hoursUntilStart = (booking.startTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (hoursUntilStart < 2) {
      throw new Error("Cannot cancel booking less than 2 hours before start time");
    }
  }

  return prisma.booking.update({
    where: { id: input.bookingId },
    data: { status: input.newStatus },
    include: { court: true },
  });
};

// Complete past bookings
export const autoCompletePastBookings = async () => {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

  return prisma.booking.updateMany({
    where: {
      status: BookingStatus.CONFIRMED,
      endTime: { lt: oneHourAgo },
    },
    data: { status: BookingStatus.COMPLETED },
  });
};

// Get booking statistics
export const getBookingStats = async (
  courtId?: string,
  startDate?: Date,
  endDate?: Date
) => {
  const where: any = {};

  if (courtId) {
    where.courtId = courtId;
  }

  if (startDate || endDate) {
    where.startTime = {};
    if (startDate) where.startTime.gte = startDate;
    if (endDate) where.startTime.lte = endDate;
  }

  const [total, byStatus] = await Promise.all([
    prisma.booking.count({ where }),
    prisma.booking.groupBy({
      by: ['status'],
      where,
      _count: true,
    }),
  ]);

  // Format utilization data
  const statusCounts: Record<string, number> = {};
  byStatus.forEach((item: { status: string; _count: number }) => {
    statusCounts[item.status] = item._count;
  });

  return {
    total,
    byStatus: statusCounts,
  };
};

// Check specific court availability
export const checkCourtAvailability = async (
  courtId: string,
  startTime: string,
  endTime: string,
  excludeBookingId?: string
) => {
  const start = new Date(startTime);
  const end = new Date(endTime);

  const conflictCheck = await checkBookingConflicts(courtId, start, end, excludeBookingId);
  
  return {
    available: !conflictCheck.hasConflict,
    conflict: conflictCheck.conflictingBooking,
    message: conflictCheck.message,
  };
};

// Get booking by ID
export const getBookingById = async (id: string) => {
  return prisma.booking.findUnique({
    where: { id },
    include: { court: true },
  });
};

// Delete booking
export const deleteBooking = async (id: string) => {
  return prisma.booking.delete({
    where: { id },
  });
};

// Export the BookingStatus for use in other files
export { BookingStatus };
export type { BookingStatusType };
