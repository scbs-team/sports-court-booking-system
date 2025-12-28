import { BookingStatus } from '@prisma/client';

export function canTransition(current: BookingStatus, next: BookingStatus): boolean {
  const validTransitions: Record<BookingStatus, BookingStatus[]> = {
    PENDING: [BookingStatus.CONFIRMED, BookingStatus.CANCELLED],
    CONFIRMED: [BookingStatus.COMPLETED, BookingStatus.CANCELLED],
    CANCELLED: [],
    COMPLETED: [],
  };

  return validTransitions[current].includes(next);
}
