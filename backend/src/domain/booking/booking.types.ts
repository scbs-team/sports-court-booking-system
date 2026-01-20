import { BookingStatus } from "@prisma/client";

export { BookingStatus };

export type BookingTimeRange = {
  startTime: Date;
  endTime: Date;
};

export type BookingConflictCheck = BookingTimeRange & {
  courtId: number;
  excludeBookingId?: number;
};

export type CreateBookingInput = {
  courtId: number;
  startTime: string | Date;
  endTime: string | Date;
  userId?: string;
};

export type GetBookingsFilters = {
  courtId?: number;
  status?: BookingStatus;
  fromDate?: Date;
  toDate?: Date;
  userId?: string;
};

export type UpdateBookingStatusInput = {
  bookingId: number;
  newStatus: BookingStatus;
  currentStatus?: BookingStatus;
};

export type AvailabilityOptions = {
  excludeCourtIds?: number[];
  includeCourtIds?: number[];
};

export type BookingStats = {
  total: number;
  byStatus: Record<string, number>;
  utilizationRate?: number;
};

export type TimeRange = {
  start: Date;
  end: Date;
};

export type ValidatedTimeRange = TimeRange & {
  durationHours: number;
  durationMinutes: number;
};

export type PrismaWhereInput = {
  courtId?: number | { equals?: number; not?: number; in?: number[]; notIn?: number[] };
  status?: BookingStatus | { in?: BookingStatus[] };
  startTime?: { gte?: Date; lte?: Date };
  userId?: string;
  id?: { not?: number };
  AND?: any[];
};
