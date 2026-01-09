// Define BookingStatus enum locally
export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED'
}

export interface CreateBookingInput {
  courtId: string;
  startTime: string;
  endTime: string;
  userId?: string;
}

export interface GetBookingsFilters {
  courtId?: string;
  status?: BookingStatus;
  fromDate?: Date;
  toDate?: Date;
  userId?: string;
}

export interface UpdateBookingStatusInput {
  bookingId: string;
  newStatus: BookingStatus;
  currentStatus?: BookingStatus;
}

export interface ConflictCheckResult {
  hasConflict: boolean;
  conflictingBooking?: any;
  message?: string;
}

export interface AvailabilityOptions {
  excludeCourtIds?: string[];
  includeCourtIds?: string[];
}

export interface BookingStats {
  total: number;
  byStatus: Record<string, number>;
  utilizationRate?: number;
}

export interface TimeRange {
  start: Date;
  end: Date;
}

export interface ValidatedTimeRange extends TimeRange {
  durationHours: number;
  durationMinutes: number;
}

// Prisma-like types for query building
export interface PrismaWhereInput {
  courtId?: string | { equals?: string; not?: string };
  status?: BookingStatus | { in?: BookingStatus[] };
  startTime?: { gte?: Date; lte?: Date };
  userId?: string;
  id?: { not?: string };
  AND?: any[];
}
