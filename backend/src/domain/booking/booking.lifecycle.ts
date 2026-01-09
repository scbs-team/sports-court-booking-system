import { BookingStatus } from '@prisma/client';

const TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  PENDING: [BookingStatus.CONFIRMED, BookingStatus.CANCELLED],
  CONFIRMED: [BookingStatus.COMPLETED, BookingStatus.CANCELLED],
  COMPLETED: [],
  CANCELLED: [],
};

export function assertStatusTransitionAllowed(
  from: BookingStatus,
  to: BookingStatus,
) {
  const allowed = TRANSITIONS[from]?.includes(to);

  if (!allowed) {
    throw new Error(`Invalid booking status transition: ${from} → ${to}`);
  }
}

export function assertCanCompleteBooking(
  status: BookingStatus,
  endTime: Date,
) {
  if (status !== BookingStatus.CONFIRMED) {
    throw new Error('Only confirmed bookings can be completed');
  }

  if (new Date() < endTime) {
    throw new Error('Cannot complete booking before it ends');
  }
}

export function assertCanCancelBooking(
  status: BookingStatus,
) {
  if (
    status !== BookingStatus.PENDING &&
    status !== BookingStatus.CONFIRMED
  ) {
    throw new Error('Only pending or confirmed bookings can be cancelled');
  }
}
