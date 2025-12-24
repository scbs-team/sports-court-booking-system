/**
 * Booking Service
 * 
 * Core business logic for court bookings.
 * Handles availability checks, overlap detection, and booking creation.
 * 
 * Business Rules:
 * - No overlapping bookings for the same court
 * - Bookings must be in the future (no past bookings)
 * - Valid duration slots: 30min, 1hr, 1.5hr, 2hr
 * - Bookings must be within operating hours (e.g., 6 AM - 10 PM)
 * - Maximum advance booking: 30 days
 */

import { prisma } from '../lib/prisma';

/**
 * Check if a time slot is available for booking
 * 
 * Algorithm:
 * 1. Query all existing bookings for the specified court
 * 2. Filter bookings that overlap with the requested time range
 * 3. Time overlap occurs when:
 *    - New booking starts before existing ends AND
 *    - New booking ends after existing starts
 * 4. Return true if no overlaps found
 * 
 * @param courtId - ID of the court to check
 * @param startTime - Requested start time (ISO 8601 datetime)
 * @param endTime - Requested end time (ISO 8601 datetime)
 * @returns Promise<boolean> - true if slot is available, false otherwise
 * 
 * @example
 * const available = await isTimeSlotAvailable(
 *   'court-123',
 *   new Date('2025-01-15T14:00:00'),
 *   new Date('2025-01-15T15:00:00')
 * );
 */
export async function isTimeSlotAvailable(
  courtId: string,
  startTime: Date,
  endTime: Date
): Promise<boolean> {
  try {
    // Query database for any bookings that overlap with requested time slot
    // Overlap logic: new booking overlaps if it starts before existing ends
    // AND ends after existing starts
    const overlappingBookings = await prisma.booking.findMany({
      where: {
        courtId: courtId,
        AND: [
          // Existing booking ends after new booking starts
          { endTime: { gt: startTime } },
          // Existing booking starts before new booking ends
          { startTime: { lt: endTime } }
        ]
      }
    });

    // If any overlapping bookings found, slot is NOT available
    return overlappingBookings.length === 0;
  } catch (error) {
    // Log error for debugging
    console.error('Error checking time slot availability:', error);
    throw new Error('Failed to check availability');
  }
}

/**
 * Create a new booking after validation
 * 
 * Process:
 * 1. Validate booking data (should be done via Zod schema before this)
 * 2. Check business rules:
 *    - Start time is in the future
 *    - Duration is valid (30min, 1hr, 1.5hr, or 2hr)
 *    - Within operating hours
 *    - Not more than 30 days in advance
 * 3. Check time slot availability (call isTimeSlotAvailable)
 * 4. Create booking in database
 * 5. Return created booking
 * 
 * @param bookingData - Validated booking request data
 * @param bookingData.courtId - ID of court to book
 * @param bookingData.userId - ID of user making booking
 * @param bookingData.startTime - Booking start time
 * @param bookingData.endTime - Booking end time
 * @returns Promise<Booking> - The created booking object
 * @throws Error if validation fails or slot is unavailable
 * 
 * @example
 * const booking = await createBooking({
 *   courtId: 'court-123',
 *   userId: 'user-456',
 *   startTime: new Date('2025-01-15T14:00:00'),
 *   endTime: new Date('2025-01-15T15:00:00')
 * });
 */
export async function createBooking(bookingData: {
  courtId: string;
  userId: string;
  startTime: Date;
  endTime: Date;
}): Promise<any> {
  const { courtId, userId, startTime, endTime } = bookingData;

  // Validate: Start time must be in the future
  if (!isInFuture(startTime)) {
    throw new Error('Booking start time must be in the future');
  }

  // Validate: End time must be after start time
  if (endTime <= startTime) {
    throw new Error('Booking end time must be after start time');
  }

  // Validate: Duration must be one of the allowed values (30, 60, 90, 120 minutes)
  if (!isValidDuration(startTime, endTime)) {
    throw new Error('Booking duration must be 30min, 1hr, 1.5hr, or 2hr');
  }

  // Validate: Booking must be within operating hours (6 AM - 10 PM)
  if (!isWithinOperatingHours(startTime, endTime)) {
    throw new Error('Booking must be within operating hours (6:00 AM - 10:00 PM)');
  }

  // Validate: Booking cannot be more than 30 days in advance
  if (!isWithinAdvanceLimit(startTime)) {
    throw new Error('Bookings cannot be made more than 30 days in advance');
  }

  // Check if the time slot is available (no overlapping bookings)
  const isAvailable = await isTimeSlotAvailable(courtId, startTime, endTime);
  if (!isAvailable) {
    throw new Error('Time slot is not available');
  }

  try {
    // Create the booking in the database
    const booking = await prisma.booking.create({
      data: {
        courtId,
        userId,
        startTime,
        endTime,
        status: 'CONFIRMED' // Default status for new bookings
      },
      // Include related court and user data in response
      include: {
        court: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return booking;
  } catch (error) {
    // Log error for debugging
    console.error('Error creating booking:', error);
    throw new Error('Failed to create booking');
  }
}

/**
 * Helper: Calculate duration in minutes between two dates
 * 
 * Used for validating booking duration against allowed values.
 * 
 * @param start - Start datetime
 * @param end - End datetime
 * @returns number - Duration in minutes
 */
function getDurationInMinutes(start: Date, end: Date): number {
  return (end.getTime() - start.getTime()) / (1000 * 60);
}

/**
 * Helper: Check if duration is valid
 * Valid durations: 30, 60, 90, 120 minutes
 * 
 * Business rule: Users can only book in specific time increments
 * to simplify scheduling and maximize court utilization.
 * 
 * @param start - Start datetime
 * @param end - End datetime
 * @returns boolean - true if duration is valid
 */
function isValidDuration(start: Date, end: Date): boolean {
  const duration = getDurationInMinutes(start, end);
  const validDurations = [30, 60, 90, 120]; // 30min, 1hr, 1.5hr, 2hr
  return validDurations.includes(duration);
}

/**
 * Helper: Check if booking is within operating hours
 * Operating hours: 6:00 AM - 10:00 PM
 * 
 * Business rule: Courts are only available during operating hours.
 * Booking must start at or after 6 AM and end at or before 10 PM.
 * 
 * @param start - Start datetime
 * @param end - End datetime
 * @returns boolean - true if within operating hours
 */
function isWithinOperatingHours(start: Date, end: Date): boolean {
  const startHour = start.getHours();
  const endHour = end.getHours();
  const endMinute = end.getMinutes();
  
  // Start must be >= 6 AM (hour 6)
  // End must be <= 10 PM (hour 22)
  // Allow exactly 10 PM as end time (22:00)
  return startHour >= 6 && (endHour < 22 || (endHour === 22 && endMinute === 0));
}

/**
 * Helper: Check if booking is in the future
 * 
 * Business rule: Cannot book time slots in the past.
 * Prevents errors and ensures data integrity.
 * 
 * @param start - Start datetime
 * @returns boolean - true if start time is in future
 */
function isInFuture(start: Date): boolean {
  return start.getTime() > Date.now();
}

/**
 * Helper: Check if booking is within maximum advance period
 * Maximum advance booking: 30 days
 * 
 * Business rule: Prevents users from booking too far in advance,
 * which could tie up courts unnecessarily.
 * 
 * @param start - Start datetime
 * @returns boolean - true if within 30 days from now
 */
function isWithinAdvanceLimit(start: Date): boolean {
  const maxAdvanceDays = 30;
  const maxAdvanceMs = maxAdvanceDays * 24 * 60 * 60 * 1000;
  const timeDiff = start.getTime() - Date.now();
  
  return timeDiff <= maxAdvanceMs;
}
