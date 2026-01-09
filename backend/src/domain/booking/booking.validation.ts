import { BookingTimeRange } from './booking.types';

export function validateBookingTime({ startTime, endTime }: BookingTimeRange) {
  if (endTime <= startTime) {
    throw new Error('End time must be after start time');
  }

  if (startTime < new Date()) {
    throw new Error('Cannot create bookings in the past');
  }
}
