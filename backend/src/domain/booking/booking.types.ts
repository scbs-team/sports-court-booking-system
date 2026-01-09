export type BookingTimeRange = {
  startTime: Date;
  endTime: Date;
};

export type BookingConflictCheck = BookingTimeRange & {
  courtId: number;
  excludeBookingId?: number;
};
