import { validateBookingTime } from './booking.validation';
import { hasBookingConflict } from './booking.conflict';
import { BookingConflictCheck } from './booking.types';

export async function assertBookingAllowed(input: BookingConflictCheck) {
  validateBookingTime(input);

  const conflict = await hasBookingConflict(input);
  if (conflict) {
    throw new Error('Time slot is already booked');
  }
}
