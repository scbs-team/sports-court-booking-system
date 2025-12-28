import { BookingStatus } from '@prisma/client';

const allowedTransitions: Record<BookingStatus, BookingStatus[]> = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['CANCELLED', 'COMPLETED'],
  CANCELLED: [],
  COMPLETED: [],
};

export function canTransition(
  from: BookingStatus,
  to: BookingStatus
): boolean {
  return allowedTransitions[from].includes(to);
}
